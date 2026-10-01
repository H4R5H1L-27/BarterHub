import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles = files.length > 0 ? files : (singleFile ? [singleFile] : []);

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of allFiles) {
      if (!file.type || !file.type.startsWith('image/')) {
        continue;
      }

      // Max size: 10MB
      if (file.size > 10 * 1024 * 1024) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const rawExt = path.extname(file.name);
      const ext = rawExt || (file.type === 'image/png' ? '.png' : file.type === 'image/webp' ? '.webp' : '.jpg');
      const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await writeFile(filePath, buffer);
      urls.push(`/uploads/${uniqueName}`);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: 'No valid image files processed. Supported formats: JPG, PNG, WEBP, GIF up to 10MB.' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      url: urls[0],
      urls,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed.' }, { status: 500 });
  }
}
