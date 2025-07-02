import { SearchIcon } from "lucide-react";

export function SearchInput() {
  return (
    <form className="flex w-full max-w-[600px]">
      <div className="relative w-full">
        <input type="text" placeholder="Search" className="w-full pl-4 py-2 pr-12 rounded-l-lg border-[1.5px] focus:outline-none focus:border-blue-500 shadow-md shadow/25" />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 bg-gray-100 border border-l-0 rounded-r-lg hover:bg-gray-200
        disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow/25
      "
      >
        <SearchIcon className="size-5" />
      </button>
    </form>
  );
}
