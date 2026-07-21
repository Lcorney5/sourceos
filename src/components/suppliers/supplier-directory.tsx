"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/form";
import { Table, Thead, Th, Tr, Td, EmptyState } from "@/components/ui/table";
import { SearchIcon, PinIcon, MailIcon, ExternalLinkIcon } from "@/components/ui/icons";
import type { Database } from "@/lib/supabase/database.types";

type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];

export function SupplierDirectory({ suppliers }: { suppliers: Supplier[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return suppliers;
    return suppliers.filter((s) =>
      [s.name, s.location, s.contact_email, s.contact_phone]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [suppliers, query]);

  return (
    <div>
      <div className="relative mb-4">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
          <SearchIcon size={16} />
        </span>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, location, email, phone..."
          className="pl-10"
        />
      </div>

      {!filtered.length ? (
        <EmptyState message="No suppliers match your search." />
      ) : (
        <Table>
          <Thead>
            <tr>
              <Th>Supplier</Th>
              <Th>Location</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>WhatsApp</Th>
              <Th></Th>
            </tr>
          </Thead>
          <tbody>
            {filtered.map((supplier) => (
              <Tr key={supplier.id}>
                <Td className="font-semibold">{supplier.name}</Td>
                <Td>
                  {supplier.location ? (
                    <span className="flex items-center gap-1.5 text-muted">
                      <PinIcon size={14} />
                      {supplier.location}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Td>
                <Td>
                  {supplier.contact_email ? (
                    <span className="flex items-center gap-1.5 text-steel">
                      <MailIcon size={14} />
                      {supplier.contact_email}
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </Td>
                <Td className="font-mono">{supplier.contact_phone ?? "—"}</Td>
                <Td className="font-mono">{supplier.whatsapp_number ?? "—"}</Td>
                <Td>
                  <Link
                    href={`/dashboard/suppliers/${supplier.id}`}
                    className="text-muted hover:text-rust"
                    aria-label={`View ${supplier.name}`}
                  >
                    <ExternalLinkIcon size={14} />
                  </Link>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
