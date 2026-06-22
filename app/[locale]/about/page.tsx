import { getTranslations } from 'next-intl/server';

export const metadata = {
  title: 'About - Character Search',
  description: 'About Character Search application',
};

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <main className="simple-page">
      <h2>{t('about.title')}</h2>
      <p>{t('about.description')}</p>
      <a
        href="https://rs.school/courses/reactjs"
        target="_blank"
        rel="noreferrer"
      >
        {t('about.courseLink')}
      </a>
    </main>
  );
}
