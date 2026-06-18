import { NextRequest, NextResponse } from 'next/server';
import { updateAddress, deleteAddress, setDefaultAddress } from '@/lib/addresses';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const address = await updateAddress(id, body);
    return NextResponse.json({ address });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = req.nextUrl;
    const userId = searchParams.get('userId');

    if (userId) await setDefaultAddress(userId, id);
    await deleteAddress(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (body.action === 'set-default') {
      await setDefaultAddress(body.userId, id);
      return NextResponse.json({ success: true });
    }
    const address = await updateAddress(id, body);
    return NextResponse.json({ address });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}
