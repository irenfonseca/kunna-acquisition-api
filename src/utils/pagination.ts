export function parsePage(q: any) {
    const page = Math.max(1, parseInt(q.page ?? '1', 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(q.pageSize ?? '5', 10) || 5));
    const skip = (page - 1) * pageSize;
    return { page, pageSize, skip, limit: pageSize };
}