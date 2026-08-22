import React from 'react';
import Layout from '../layouts/Layout';
import { ScrollRegister } from '../components/features/scroll';

const CurationScrollsPage = () => (
    <Layout>
        <ScrollRegister kind="curation" />
    </Layout>
);

export default CurationScrollsPage;
