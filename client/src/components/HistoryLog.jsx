import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TrackingTable() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">UserId</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>12345</TableCell>
              <TableCell>Document Processing</TableCell>
              <TableCell>2024-12-01</TableCell>
              <TableCell>Approved for processing</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
