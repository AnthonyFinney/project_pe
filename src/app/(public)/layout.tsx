export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <main>{children}</main>;
}
