import BasicsLayout from "../../components/Basics/BasicsLayout";
import IoLoading from '../../components/IoLoading'

import PictureBox from "../../components/Basics/PictureBox";

import { useRouter } from "next/router";
import { MDXProvider } from "@mdx-js/react";
import dynamic from "next/dynamic";
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import { useEffect, useState } from "react";

import fs from 'fs'
import path from 'path'


const components = {
    PictureBox
}

export default function BasicsPage( {mdxContent }) {
    const router = useRouter();
    const { slug } = router.query;

    const slugPath = Array.isArray(slug) ? slug.join('/') : slug

    const headings = useHeadings(mdxContent)

    const MdxContent = dynamic(() => import(`../../basics/${slugPath}.mdx`), {
        loading: () => <IoLoading />
    })


    return (
        <BasicsLayout headings={headings}>
            <MDXProvider components={components}>
                <MdxContent />
            </MDXProvider>
        </BasicsLayout>
    )
}

const extractHeadings = async (content) => {
    const headings = []
    await remark().use(remarkMdx).use(() => (tree) => {
        function visit(node) {
            if (node.type === 'heading') {
                const depth = node.depth
                const text = node.children.map(child => child.value).join('')
                const id = text.toLowerCase().replace(/\s+/g, '-')
                headings.push( { depth, text, id })
            }
            if (node.children) node.children.forEach(visit)
        }
        visit(tree)
    }).process(content)
    return headings
}

const useHeadings = (content) => {
    const [headings, setHeadings] = useState([])

    useEffect(() => {
        if(content){
            extractHeadings(content).then(setHeadings)
        }
    }, [content])

    return headings
}

export async function getStaticProps({ params }) {
    const slugPath = params.slug ? params.slug.join('/') : '';
    const filePath = path.join(process.cwd(), 'src/basics', `${slugPath}.mdx`);

    let mdxContent = '';
    try {
        mdxContent = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error("Error reading MDX file:", error);
    }

    return {
        props: { mdxContent }
    };
}

export async function getStaticPaths() {
    // If you'd like dynamic paths, read all possible slugs here to create them
    return {
        paths: [],
        fallback: 'blocking'
    };
}