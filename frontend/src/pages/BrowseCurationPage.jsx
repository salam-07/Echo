import React from 'react';
import Layout from '../layouts/Layout';
import { CommunityRegister } from '../components/features/browse';

const BrowseCurationPage = () => (
    <Layout>
        <CommunityRegister kind="curation" />
    </Layout>
);

export default BrowseCurationPage;
