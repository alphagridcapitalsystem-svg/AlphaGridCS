import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Landmark, Mail, ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SignUpSuccessPage() {
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
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>
                We have sent a confirmation link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Please click the link in the email to verify your account and start investing. 
                If you do not see the email, check your spam folder.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/auth/login">
                  <Button className="w-full gap-2">
                    Go to Sign In <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Back to Home
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
