import BasicsLayout from "../../components/Basics/BasicsLayout";

import { useRouter } from "next/router";
import { MDXProvider } from "@mdx-js/react";
import dynamic from "next/dynamic";

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'




export default function BasicsPage({ fileContent, files }) {
    const router = useRouter();
    const { slug } = router.query;

    const MdxContent = dynamic(() => import(`../../basics/${slug}.mdx`))

    return (
        <BasicsLayout files={files}>
            <MdxContent />
        </BasicsLayout>
    );
}




// Function to fetch all markdown files in the basics folder
const getBasicsFiles = () => {
    const basicsPath = path.join(process.cwd(), 'src', 'basics');
    const filenames = fs.readdirSync(basicsPath);

    return filenames.map(filename => ({
        name: filename.replace(/\.mdx$/, ''), // Remove the file extension
    }));
};

// Function to fetch content for a specific markdown file based on slug
const fetchMarkdownContent = (slug) => {
    const basicsPath = path.join(process.cwd(), 'src', 'basics');
    const filePath = path.join(basicsPath, `${slug.replace(/-/g, ' ')}.mdx`); // Convert hyphens back to spaces

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(fileContent); // Get the content and frontmatter

    return { content, title: data.title || slug.replace(/-/g, ' ')}; // Return content and title
};

export async function getStaticPaths() {
    const files = getBasicsFiles();
    const paths = files.map(file => ({
        params: { slug: file.name.replace(' ', '-') }, // Convert spaces to hyphens
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const { slug } = params;
    const { content, title } = fetchMarkdownContent(slug); // Use combined function to get content
    const files = getBasicsFiles()

    return {
        props: {
            fileContent: content,
            title: title, // Pass title to props
            files,
        },
    };
}

