import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { render,  waitFor } from '@testing-library/react';

import Repository from '../../pages/Repository';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
    return {
        useRouteMatch: () => ({
            params: {
                repository: 'rocketseat/unform'
            }
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    }
});

describe('Tests for Repository Page', () => {
    it('Should be able render repository details', async () => {

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

        const dataIssueResponse = [{
            id: 1,
            title: 'title-issue',
            html_url: 'url-issue',
            user: {
                login: 'user-login-issue',
            }
        }]

        apiMock.onGet('repos/rocketseat/unform').reply(200, dataRepositoryResponse);
        apiMock.onGet('repos/rocketseat/unform/issues').reply(200, dataIssueResponse);

        const { getByTestId } = render(<Repository />);

        await waitFor(() => {
            const repositoryIssuesList = getByTestId('repository-issues-list');
            expect(repositoryIssuesList).toBeTruthy();
        })

    });
});
