import Link from "next/link";

import { Button } from "@/ui/button";
import { EmptyState } from "@/widgets/empty-state";

export default function LeadNotFound() {
  return (
    <div className="space-y-4">
      <EmptyState title="Заявка не найдена" description="Проверьте ссылку или вернитесь в список заявок." />
      <Button asChild>
        <Link href="/leads">К списку заявок</Link>
      </Button>
    </div>
  );
}
