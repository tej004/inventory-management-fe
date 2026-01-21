import ProductTable from '../table/ProductTable';

export default function ContentContainer() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div>
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
