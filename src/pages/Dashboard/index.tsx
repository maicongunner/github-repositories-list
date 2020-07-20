import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import { Link } from 'react-router-dom';

import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem(
            '@GithubExplorer:repositories',
        );

        if (storageRepositories) {
            return JSON.parse(storageRepositories);
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(
            '@GithubExplorer:repositories',
            JSON.stringify(repositories),
        );
    }, [repositories]);

    async function handleAddRepository(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        if (!newRepo) {
            setInputError('Digite o autor/nome do repositório');
            return;
        }

        try {
            const response = await api.get<Repository>(`repos/${newRepo}`);
            const repository = response.data;
            if (repositories.some(repos => repos.full_name == repository.full_name)) {
                setInputError('Este repositório já foi adicionado a lista');
            } else {
                setRepositories([...repositories, repository]);
                setNewRepo('');
                setInputError('');
            }
        } catch (error) {
            setInputError('Erro na busca por este repositório');
        }
    }

    return (
        <>
            <img src={logoImg} alt="Github Explorer" />
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                    type="text"
                    placeholder="Digite o nome do repositório"
                    value={newRepo}
                    onChange={e => setNewRepo(e.target.value)}
                    data-testid="form-field"
                />
                <button type="submit" data-testid="form-btn">
                    Pesquisar
                </button>
            </Form>

            {inputError && (
                <Error data-testid="field-error-message">{inputError}</Error>
            )}

            <Repositories data-testid="list-repositories">
                {repositories.map(repository => (
                    <Link
                        key={repository.full_name}
                        to={`/repositories/${repository.full_name}`}
                    >
                        <img
                            src={repository.owner.avatar_url}
                            alt={repository.owner.login}
                        />
                        <div>
                            <strong>{repository.full_name}</strong>
                            <p>{repository.description}</p>
                        </div>
                        <FiChevronRight size={20} />
                    </Link>
                ))}
            </Repositories>
        </>
    );
};

export default Dashboard;
