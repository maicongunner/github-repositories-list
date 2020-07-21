import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { render,  waitFor } from '@testing-library/react';
import { useRouteMatch } from 'react-router-dom';

import Repository from '../../pages/Repository';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
    return {
        useRouteMatch: () => ({
            params: 'rocketseat/unform'
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    }
});

describe('Tests for Repository Page', () => {
    it('Should be render repository details', async () => {

        const { getByTestId } = render(<Repository />);
        const repositoryNumbers = await waitFor(() => getByTestId('repository-numbers'));
        const repositoryIssuesList = await waitFor(() => getByTestId('repository-issues-list'));
        const repositoryInfo = await waitFor(() => getByTestId('repository-info'));
        const { params } = useRouteMatch();

        const dataRepositoryResponse = {
            full_name: 'Rocketseat/unform',
            description: 'Easy peasy highly scalable ReactJS & React Native forms!',
            stargazers_count: 100,
            forks_count: 100,
            open_issues_count: 100,
            owner: {
                login: 'Rocketseat',
                avatar_url: 'https://avatars0.githubusercontent.com/u/28929274?v=4',
            }
        }

        const dataIssueResponse = {
            id: 1,
            title: 'title-issue',
            html_url: 'url-issue',
            user: {
                login: 'user-login-issue',
            }
        }

        await waitFor(() => {
            apiMock.onGet(`repos/${params}`).reply(200, dataRepositoryResponse);
            expect(repositoryInfo).toHaveTextContent('Rocketseat/unform');
            apiMock.onGet(`repos/${params}/issues`).reply(200, dataIssueResponse);
        })

    });
});
