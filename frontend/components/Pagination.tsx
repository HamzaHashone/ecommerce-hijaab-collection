import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePaginationStore } from "./store/PaginationStore";
import { useState } from "react";
export function PaginationDemo() {
  const [activePage, setActivePage] = useState(1);
  const { total, setOffset, offset } = usePaginationStore();
  const limit = 10;
  const pages = Math.ceil(total / limit);
  // const pages = 10;
  // Show up to 3 pages after active page
  const startPage = activePage;
  const endPage = Math.min(activePage + 5, pages);
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            className="hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (activePage > 1) {
                setActivePage(activePage - 1);
                setOffset(offset - limit);
              }
            }}
          />
        </PaginationItem>
        {/* Ellipsis for pages before visible range */}
        {activePage > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* Visible Pages */}
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
          const pageNum = startPage + i;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                className="hover:cursor-pointer"
                isActive={activePage === pageNum}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(pageNum);
                  setOffset(limit * i);
                }}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* Ellipsis for pages after visible range */}
        {endPage < pages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            className="hover:cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              if (activePage < pages) {
                setActivePage(activePage + 1);
                setOffset(offset + limit);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
