import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';
import { render,  waitFor } from '@testing-library/react';
import { useRouteMatch } from 'react-router-dom';

import Repository from '../../pages/Repository';

const apiMock = new MockAdapter(api);

jest.mock('react-router-dom', () => {
    return {
        useRouteMatch: jest.fn(() => {
            params: {repository: 'repository-link'}
        }),
        Link: ({ children }: { children: React.ReactNode }) => children,
    }
});

describe('Tests for Repository Page', () => {
    it('Should be render repository details', async () => {

        const repositoryElement = render(<Repository />);
        const { repository } = useRouteMatch();

        const dataResponse = {
            full_name: 'repo-name',
            description: 'repo-description',
            stargazers_count: 100,
            forks_count: 100,
            open_issues_count: 100,
            owner: {
                login: 'repo-login',
                avatar_url: 'repo-avatar-url',
            }
        }

        await waitFor(() => {
            apiMock.onGet(`repos/${repository}`).reply(200, dataResponse);
            expect(repositoryElement).toBeTruthy();
        })

    });
});
