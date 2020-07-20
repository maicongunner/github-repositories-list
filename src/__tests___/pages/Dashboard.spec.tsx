import React from 'react';
import Dashboard from '../../pages/Dashboard';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

import { render, waitFor, fireEvent } from '@testing-library/react';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
    return {
        Link: ({ children }: { children: React.ReactNode }) => children,
    };
});

describe('Tests for Dashboard Page', () => {

    it('Should add new repository when form has been submitted', async () => {
        const { getByTestId, getByText } = render(<Dashboard />);

        const inputElement = await waitFor(() => getByTestId('form-field'));
        const buttonElement = await waitFor(() => getByText('Pesquisar'));
        const listRepositories = await waitFor(() =>
            getByTestId('list-repositories'),
        );

        const newRepo = 'rocketseat/unform';

        fireEvent.change(inputElement, { target: { value: newRepo } });
        expect(inputElement).toHaveValue(newRepo);
        fireEvent.click(buttonElement);

        const dataResponse = {
            full_name: 'Rocketseat/unform',
            description: 'Rocketseat/unform',
            owner: {
                login: 'Rocketseat',
                avatar_url: 'https://avatars0.githubusercontent.com/u/28929274?v=4',
            }
        };

        await waitFor(() => {
            apiMock.onGet(`repos/${newRepo}`).reply(200, dataResponse);
            expect(listRepositories).toBeDefined();
            expect(inputElement).toBeEmpty();
        });
    });

    it('Should not add new repository when form has been submitted in with invalid repository', async () => {
        const { getByTestId, getByText } = render(<Dashboard />);

        const inputElement = await waitFor(() => getByTestId('form-field'));
        const buttonElement = await waitFor(() => getByText('Pesquisar'));

        const newRepo = 'rocketseat';

        fireEvent.change(inputElement, { target: { value: newRepo } });
        expect(inputElement).toHaveValue(newRepo);
        fireEvent.click(buttonElement);

        const dataResponse = {
            message: 'Not Found',
            documentation_url: 'https://developer.github.com/v3'
        };

        await waitFor(() => {
            apiMock.onGet(`repos/${newRepo}`).reply(400, dataResponse);
            const messageErrorElement = getByTestId('field-error-message');
            expect(messageErrorElement).toHaveTextContent(
                'Erro na busca por este repositório',
            );
        });

    });

    it('Should fail add new repository when form has been submitted with input field is empty', async () => {
        const { getByTestId, getByText } = render(<Dashboard />);

        const inputElement = await waitFor(() => getByTestId('form-field'));
        const buttonElement = await waitFor(() => getByText('Pesquisar'));

        const newRepo = '';

        fireEvent.change(inputElement, { target: { value: newRepo } });
        expect(inputElement).toHaveValue('');
        fireEvent.click(buttonElement);

        await waitFor(() => {
            const messageErrorElement = getByTestId('field-error-message');
            expect(messageErrorElement).toHaveTextContent(
                'Digite o autor/nome do repositório',
            );
        });
    });

});
