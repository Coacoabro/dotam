/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
})

const nextConfig = {
    pageExtensions: ['js', 'md', 'mdx']
}

module.exports = withMDX(nextConfig)
