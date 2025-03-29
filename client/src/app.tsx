import { Layout } from '@/components';
import { default as Pages } from './pages';
import { default as Providers } from './providers';

function App() {
  return (
    <>
      <Providers>
        <Layout>
          <Pages />
        </Layout>
      </Providers>
    </>
  );
}

export default App;
