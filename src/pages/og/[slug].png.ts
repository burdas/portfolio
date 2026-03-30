import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  const experience = await getCollection('experience');

  const projectPaths = projects.map((p) => ({
    params: { slug: p.id.replace(/\.md$/, '') },
    props: { title: p.data.name, description: p.data.description, type: 'Proyecto' },
  }));

  const experiencePaths = experience.map((e) => ({
    params: { slug: e.slug },
    props: { title: e.data.role, description: e.data.company, type: 'Experiencia' },
  }));

  return [...projectPaths, ...experiencePaths];
}

export const GET: APIRoute = async ({ props }) => {
  const { title, description, type } = props;

  const fontsDir = path.join(process.cwd(), 'node_modules/@fontsource/jetbrains-mono/files');
  const fontRegular = fs.readFileSync(path.join(fontsDir, 'jetbrains-mono-latin-400-normal.woff'));
  const fontBold = fs.readFileSync(path.join(fontsDir, 'jetbrains-mono-latin-700-normal.woff'));

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1a1a1a 0%, #0a0a0a 100%)',
          padding: '80px',
          fontFamily: 'JetBrains Mono',
          color: 'white',
          border: '20px solid #6366f1',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#6366f1',
                      borderRadius: '50%',
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      color: '#6366f1',
                    },
                    children: type,
                  },
                },
              ],
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '84px',
                fontWeight: 700,
                margin: '0 0 20px 0',
                lineHeight: 1.1,
              },
              children: title,
            },
          },
          {
            type: 'p',
            props: {
              style: {
                fontSize: '32px',
                margin: 0,
                color: '#a3a3a3',
                maxWidth: '900px',
                lineHeight: 1.4,
              },
              children: description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '80px',
                left: '80px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#4b5563',
                    },
                    children: 'burdaspar.com',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'JetBrains Mono',
          data: fontBold,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = new Uint8Array(Array.from(pngData.asPng()));

  const blob = new Blob([pngBuffer], { type: 'image/png' });

  return new Response(blob, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
