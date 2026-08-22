import React from 'react';
import Layout from '../layouts/Layout';
import { CommunityRegister } from '../components/features/browse';

const BrowseScrollsPage = () => (
    <Layout>
        <CommunityRegister kind="feed" />
    </Layout>
);

export default BrowseScrollsPage;
