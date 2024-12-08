// import { useState, useEffect } from "react";
// import useAuthStore from "../store/useAuthStore";

// import { GrValidate } from "react-icons/gr";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export default function ReviewerPage() {
//   const { accessToken, documents, setDocuments } = useAuthStore();

//   const [filterStatus, setFilterStatus] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState(null);
//   const [documentRemarks, setDocumentRemarks] = useState("");
//   const [documentStatus, setDocumentStatus] = useState("");
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const filteredItems =
//     filterStatus === "all" || filterStatus === ""
//       ? documents
//       : documents.filter((document) => document.status === filterStatus);

//   const handleReviewClick = (document) => {
//     setSelectedDocument(document);
//     setDocumentRemarks(document.remarks || "");
//     setDocumentStatus(document.status || "Pending");
//     setIsDialogOpen(true);
//   };

//   const handleReview = async () => {
//     if (!selectedDocument) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const updatedData = {
//         remarks: documentRemarks,
//         status: documentStatus,
//       };

//       const res = await fetch(
//         `http://localhost:5000/api/v1/documents/${selectedDocument._id}`,
//         {
//           method: "PATCH",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(updatedData),
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const updatedDocuments = documents.map((doc) =>
//         doc._id === selectedDocument._id
//           ? { ...doc, remarks: documentRemarks, status: documentStatus }
//           : doc
//       );
//       setDocuments(updatedDocuments);

//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error("Error editing document:", error);
//     }
//   };

//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const year = date.getFullYear();

//     return `${month}/${day}/${year}`;
//   };

//   useEffect(() => {
//     const fetchDocuments = async (token) => {
//       try {
//         const res = await fetch("http://localhost:5000/api/v1/documents", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await res.json();
//         setDocuments(data);
//       } catch (error) {
//         console.error("Error fetching documents", error.message);
//       }
//     };

//     fetchDocuments(accessToken);
//   });
//   return (
//     <div className="flex flex-col items-center p-4">
//       <div className="p-6 font-sans">
//         <div className="mb-6">
//           <label
//             htmlFor="statusFilter"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           ></label>
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger className="w-full sm:w-[200px]">
//               <SelectValue placeholder="Select status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All</SelectItem>
//               <SelectItem value="Pending">Pending</SelectItem>
//               <SelectItem value="Approved">Approved</SelectItem>
//               <SelectItem value="Rejected">Rejected</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>
//       <Card className="w-full mt-12">
//         <CardHeader className="flex flex-col items-center justify-between gap-4">
//           <CardTitle className="text-center">Documents to Review</CardTitle>
//         </CardHeader>
//         <CardContent className="overflow-x-auto">
//           <div className="min-w-[600px]">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[200px]">Name</TableHead>
//                   <TableHead className="w-[200px]">Tracking Number</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Date Received</TableHead>

//                   <TableHead>Remarks</TableHead>
//                   <TableHead className="text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredItems.map((document) => (
//                   <TableRow key={document._id}>
//                     <TableCell className="font-medium">
//                       {document.name}
//                     </TableCell>
//                     <TableCell>{document.trackingNo}</TableCell>
//                     <TableCell>{document.type}</TableCell>
//                     <TableCell
//                       className={`
//     ${
//       document.status === "Rejected"
//         ? "text-red-500"
//         : document.status === "Pending"
//         ? "text-yellow-500"
//         : document.status === "Approved"
//         ? "text-green-500"
//         : "text-gray-500"
//     }
//   `}
//                     >
//                       {document.status}
//                     </TableCell>
//                     <TableCell>{formatDate(document.assignedDate)}</TableCell>

//                     <TableCell>{document.remarks}</TableCell>
//                     <TableCell className="flex gap-2 justify-end">
//                       <Dialog
//                         open={isDialogOpen}
//                         onOpenChange={setIsDialogOpen}
//                       >
//                         <DialogTrigger asChild>
//                           <Button onClick={() => handleReviewClick(document)}>
//                             <GrValidate />
//                             <span>Review</span>
//                           </Button>
//                         </DialogTrigger>
//                         {
//                           <DialogContent className="sm:max-w-[425px]">
//                             <DialogHeader>
//                               <DialogTitle>Review Document</DialogTitle>
//                               <DialogDescription>
//                                 {document.name}
//                               </DialogDescription>
//                             </DialogHeader>
//                             <div className="grid gap-4 py-4">
//                               {/* Remarks Section */}
//                               <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="remarks" className="text-right">
//                                   Remarks
//                                 </Label>
//                                 <div className="col-span-3">
//                                   <Textarea
//                                     id="remarks"
//                                     value={documentRemarks}
//                                     onChange={(e) =>
//                                       setDocumentRemarks(e.target.value)
//                                     }
//                                     placeholder="Type your remarks here."
//                                     className="w-full"
//                                   />
//                                 </div>
//                               </div>

//                               {/* Status Section */}
//                               <div className="grid grid-cols-4 items-center gap-4">
//                                 <Label htmlFor="status" className="text-right">
//                                   Status
//                                 </Label>
//                                 <div className="col-span-3">
//                                   <Select
//                                     value={documentStatus}
//                                     onValueChange={setDocumentStatus}
//                                   >
//                                     <SelectTrigger className="w-full">
//                                       <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                       <SelectItem value="Pending">
//                                         Pending
//                                       </SelectItem>
//                                       <SelectItem value="Approved">
//                                         Approved
//                                       </SelectItem>
//                                       <SelectItem value="Rejected">
//                                         Rejected
//                                       </SelectItem>
//                                     </SelectContent>
//                                   </Select>
//                                 </div>
//                               </div>
//                             </div>

//                             <DialogFooter>
//                               <Button type="submit" onClick={handleReview}>
//                                 Save changes
//                               </Button>
//                             </DialogFooter>
//                           </DialogContent>
//                         }
//                       </Dialog>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
