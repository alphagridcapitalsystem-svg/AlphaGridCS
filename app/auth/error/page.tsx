import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Landmark, AlertCircle, ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/" className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold text-foreground">AlphaGrid Capital System</span>
        </Link>
        <ThemeToggle />
      </header>
      
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>
                Something went wrong during authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                There was an error processing your authentication request. 
                This could be due to an expired link or invalid credentials. 
                Please try again.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button className="w-full">
                    Try Again
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
