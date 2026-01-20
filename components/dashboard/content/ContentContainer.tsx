import { ChartTable } from '../chart/ChartTable';
import ProductTable from '../product-table/ProductTable';
import { SectionCards } from '../section-cards/SectionCards';

export default function ContentContainer() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-1 md:gap-4 md:py-1">
          <SectionCards />
        </div>
        <div className="flex flex-col gap-2 py-1 md:gap-4 md:py-1">
          <ChartTable />
        </div>
        <div>
          <ProductTable />
        </div>
      </div>
    </div>
  );
}
