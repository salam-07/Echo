import React from 'react';
import Layout from '../layouts/Layout';
import { ScrollRegister } from '../components/features/scroll';

const FeedScrollsPage = () => (
    <Layout>
        <ScrollRegister kind="feed" />
    </Layout>
);

export default FeedScrollsPage;
