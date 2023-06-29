
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from '@heroicons/react/20/solid'
import { Menu, Transition } from '@headlessui/react'

/* eslint-disable-next-line */
export interface PageHeaderProps {
  title: string,
  filterComponent?: React.ReactNode;
  analyticsComponent?: React.ReactNode;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function PageHeader({
  title,
  filterComponent,
  analyticsComponent
}: PageHeaderProps) {
  return (
    <header className="bg-white shadow">
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
          {analyticsComponent && <div>{analyticsComponent}</div>}
        </div> 
        <div className="min-w-0 flex-1 text-right">
        {filterComponent && <div>{filterComponent}</div>}
        </div> 
      </div>
    </div>
  </header>
  );
}
