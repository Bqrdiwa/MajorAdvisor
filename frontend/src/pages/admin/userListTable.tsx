import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  getKeyValue,
  Pagination,
  Input,
  Image,
  Select,
  SelectItem,
} from "@heroui/react";
import { useInfiniteScroll } from "@heroui/use-infinite-scroll";
import { useAsyncList } from "@react-stately/data";
import { BACKEND_BASE_URL } from "../../api/Setting";
import SearchIcon from "../../assets/search-normal.svg";

// 🔹 Translation dictionary for state
export const stateDict: Record<string, string> = {
  Nothing: "فرم اطلاعات را پر نکرده",
  CompleteInformation: "فرم اطلاعات را پر کرده",
  Paid: "پرداخت شده",
  SentEvidence: "در انتظار ارسال و تایید تعهد نامه",
  Final: "انتخاب رشته تمام شده",
};

export default function UserTable({setSelected}:{setSelected: React.Dispatch<React.SetStateAction<null>>}) {
  const [hasMore, setHasMore] = useState(false);
  const [query, setQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageCursor, setPageCursor] = React.useState<number | null>(1);
  const [cpage, setCPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [state, setState] = useState("");
  const list = useAsyncList({
    async load({ signal, cursor }) {
      console.log("reloadinggg");
      const page = pageCursor || (cursor as any) || 1; // use the current page from state
      console.log(page);
      const url = new URL(`${BACKEND_BASE_URL}/api/admin/students/`);
      url.searchParams.append("page", page.toString());
      state !== "" && url.searchParams.append("State", state);
      url.searchParams.append("pageSize", "20");
      if (query) url.searchParams.append("q", query);
      setPageCursor(null);
      const res = await fetch(url.toString(), {
        signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });
      const json = await res.json();
      setTotalPages(json.totalPages);
      setTotalUsers(json.totalCount);
      setCPage(json.page);
      const nextPage = page < json.totalPages ? page + 1 : undefined;
      setHasMore(nextPage !== undefined);

      return {
        items: json.items,
        cursor: nextPage as any,
      };
    },
  });
  const [loaderRef, scrollerRef] = useInfiniteScroll({
    hasMore,
    onLoadMore: list.loadMore,
  });

  // 🔹 Reload list when query changes
  useEffect(() => {
    setPageCursor(1); // reset to page 1
    list.reload(); // reload list
  }, [query]);
  useEffect(() => {
    console.log(state);
    setPageCursor(1); // reset to page 1
    list.reload();
  }, [state]);

  // 🔹 Handle pagination clicks
  const handlePageChange = (page: number) => {
    setPageCursor(page); // set the page cursor
    list.reload(); // reload list for that page
  };

  return (
    <div>
      <Table
        isHeaderSticky
        topContent={
          <div className="flex gap-3 ">
            <Input
              onValueChange={setQuery}
              value={query}
              endContent={<Image src={SearchIcon} />}
              placeholder="جستجو در نام و نام خانوادگی..."
            />

            <Select
              placeholder="وضعیت کاربر, پیش فرض (همه)"
              selectedKeys={state ? [state] : []} // just an array
              onSelectionChange={(keys) => {
                // keys can be a string (SharedSelection)
                const selectedKey =
                  typeof keys === "string" ? keys : Array.from(keys)[0];
                setState((selectedKey as any) ?? "");
              }}
            >
              {Object.entries(stateDict).map(([key, value]) => (
                <SelectItem key={key}>{value}</SelectItem>
              ))}
            </Select>
          </div>
        }
        aria-label="Student list"
        topContentPlacement="outside"
        baseRef={scrollerRef}
        bottomContent={
          hasMore ? (
            <div className="flex w-full justify-center">
              <Spinner ref={loaderRef} color="white" />
            </div>
          ) : null
        }
        classNames={{
          base: "max-h-[520px] overflow-y-auto",
          table: "min-h-[400px]",
        }}
      >
        <TableHeader>
          <TableColumn key="firstName">نام</TableColumn>
          <TableColumn key="lastName">نام خانوادگی</TableColumn>
          <TableColumn key="phone">شماره تماس</TableColumn>
          <TableColumn key="state">وضعیت</TableColumn>
          <TableColumn key="createdAt">تاریخ ورود</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={list.isLoading}
          items={list.items}
          loadingContent={<Spinner />}
          emptyContent={
            list.isLoading ? <Spinner size="sm" /> : "دانشجویی یافت نشد"
          }
        >
          {(item: any) => (
            <TableRow
                onClick={()=>setSelected(item)}
              className="hover:bg-default-100 cursor-pointer"
              key={item.studentId}
            >
              {(columnKey) => {
                if (columnKey === "state")
                  return (
                    <TableCell>
                      {stateDict[getKeyValue(item, columnKey)] ??
                        getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                if (columnKey === "createdAt")
                  return (
                    <TableCell>
                      {new Date(
                        getKeyValue(item, columnKey)
                      ).toLocaleDateString("fa-IR")}
                    </TableCell>
                  );
                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination at the bottom */}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          page={cpage}
          total={totalPages}
          isDisabled={list.isLoading}
          onChange={handlePageChange}
        />
        <p className="bg-default-100 flex items-center justify-center h-9 px-4 rounded-md">
          تعداد کاربران: {totalUsers}
        </p>
      </div>
    </div>
  );
}
