import { NextRequest, NextResponse } from 'next/server';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '@/lib/admin';

export async function GET() {
  try {
    const discounts = await getDiscounts();
    return NextResponse.json({ discounts });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const discount = await createDiscount(body);
    return NextResponse.json({ discount }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const discount = await updateDiscount(id, data);
    return NextResponse.json({ discount });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    await deleteDiscount(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
