import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function middleware(req: any) {
  const url = req.nextUrl.clone()

  const pathname = url.pathname

  // allow these always
  const isMaintenancePage = pathname === "/maintenance"
  const isApi = pathname.startsWith("/api")
  const isStatic = pathname.startsWith("/_next")

  if (isApi || isStatic) return NextResponse.next()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user?.id)
  .single()

const role = profile?.role

  const isAdmin =
    role === "admin" ||
    role === "super_admin"

  // fetch settings safely
  const url_from_env = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const res = await fetch(`${url_from_env}/api/settings`)
  const settings = await res.json().catch(() => null)

  const maintenanceEnabled = settings?.maintenance_mode === true

  // -----------------------------
  // CASE 1: maintenance ON
  // -----------------------------
  if (maintenanceEnabled && !isAdmin) {
    if (!isMaintenancePage && !isAdmin) {
      url.pathname = "/maintenance"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // -----------------------------
  // CASE 2: maintenance OFF
  // -----------------------------
  if (!maintenanceEnabled && isMaintenancePage) {
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}