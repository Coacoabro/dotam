/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: async () => {
        const [remarkMdx, remarkSlug, rehypeAutoLinkHeadings] = await Promise.all([
            import('remark-mdx'),
            import('remark-slug'),
            import('rehype-autolink-headings')
        ])
        
        return {
            remarkPlugins: [remarkMdx.default, remarkSlug.default],
            rehypePlugins: [rehypeAutoLinkHeadings.default],
        }
    },
})

const nextConfig = {
    pageExtensions: ['js', 'md', 'mdx']
}

module.exports = withMDX(nextConfig)
