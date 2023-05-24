import styles from './page-header.module.css';

/* eslint-disable-next-line */
export interface PageHeaderProps {
  title: string
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{props.title}</h1>
      </div>
    </header>
  );
}

export default PageHeader;
