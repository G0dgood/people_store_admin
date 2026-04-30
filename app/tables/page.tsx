"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  CollapsibleTable
} from "@/app/components/Table";
import { Badge } from "@/app/components/Badge";
import { Checkbox } from "@/app/components/Form";
import { Icon } from "@/app/components/Icon";

export default function TableDemo() {
  const rowData = Array(6).fill({
    text1: "Text cell",
    text2: "Text cell",
    number: "123456789",
  });

  const collapsibleGroups = [
    {
      id: "g1",
      heading: "Row heading",
      count: 42234,
      rows: [
        { c1: "Text cell", c2: "Text cell", c3: "1234567.00", c4: "2 050" },
        { c1: "Text cell", c2: "Text cell", c3: "1234567.00", c4: "5 766" },
        { c1: "Text cell", c2: "Text cell", c3: "1234567.00", c4: "753" },
      ]
    },
    { id: "g2", heading: "Row heading", count: 24234, rows: [] },
    { id: "g3", heading: "Row heading", count: 7654, rows: [] },
  ];

  const ActionIcons = () => (
    <div className="flex gap-2">
      <div className="w-5 h-5 rounded bg-gray-400" />
      <div className="w-5 h-5 rounded bg-gray-400" />
      <div className="w-5 h-5 rounded bg-gray-400" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-12 font-sans">
      <div className="max-w-7xl mx-auto bg-white rounded-xl  p-16 text-black">
        <h1 className="text-5xl font-bold mb-16">Table</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-20">
          {/* Simple Table Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Simple table</h2>
            <Table>
              <TableBody>
                {rowData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.text1}</TableCell>
                    <TableCell>{row.text2}</TableCell>
                    <TableCell align="right">{row.number}</TableCell>
                    <TableCell align="right">
                      <ActionIcons />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          {/* Collapsible Table Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8">Collapsible table</h2>
            <CollapsibleTable
              groups={collapsibleGroups}
              renderRow={(row, idx) => (
                <TableRow key={idx} className="bg-white">
                  <TableCell className="pl-12">{row.c1}</TableCell>
                  <TableCell>{row.c2}</TableCell>
                  <TableCell align="right">{row.c3}</TableCell>
                  <TableCell align="right">{row.c4}</TableCell>
                </TableRow>
              )}
            />
          </section>
        </div>

        {/* Large Table Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">Large table</h2>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableCell isHeader>Heading col</TableCell>
                <TableCell isHeader>Heading col</TableCell>
                <TableCell isHeader>Heading col</TableCell>
                <TableCell isHeader>Heading col</TableCell>
                <TableCell isHeader align="right">Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowData.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-sm bg-gray-400" />
                      Text cell
                    </div>
                  </TableCell>
                  <TableCell>Text cell</TableCell>
                  <TableCell>Text cell</TableCell>
                  <TableCell>Text cell</TableCell>
                  <TableCell align="right">
                    <ActionIcons />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* Base Components Footer */}
        <div className="mt-24 pt-12 border-t border-gray-200">
          <h3 className="text-gray-400 font-semibold mb-8 uppercase tracking-wider">Base components</h3>

          <div className="flex flex-col gap-12 p-12 border border-dashed border-purple-200 rounded-xl">
            <div className="flex items-center gap-12">
              <div className="w-40 text-sm font-medium text-gray-700">Text cell</div>
              <div className="w-40 flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="w-4 h-4 rounded-sm bg-gray-400" />
                Text cell
              </div>
              <div className="w-40"><ActionIcons /></div>
              <div className="w-20"><Checkbox checked onChange={() => { }} /></div>
              <div className="w-40"><Badge variant="warning">Pending</Badge></div>
              <div className="w-40 flex items-center gap-2 text-sm font-bold text-brand-gold">
                Text cell
                <Icon name="expand_more" size="xs" />
              </div>
              <div className="w-40 flex items-center gap-2 text-sm font-bold text-brand-gold">
                Text cell
                <Icon name="expand_more" size="xs" className="rotate-180" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
