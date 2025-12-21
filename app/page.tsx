import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, ChefHat, Shield, Heart, Star, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-slate-900">LunchBox</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/how-it-works" className="text-slate-600 hover:text-primary transition">How it Works</Link>
            <Link href="/cooks" className="text-slate-600 hover:text-primary transition">Browse Cooks</Link>
            <Link href="/menu" className="text-slate-600 hover:text-primary transition">Menu</Link>
            <Link href="/safety" className="text-slate-600 hover:text-primary transition">Safety</Link>
            <Link href="/about" className="text-slate-600 hover:text-primary transition">About</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4 bg-primary-100 text-primary-700 border-primary-200">
          Certified Home Cooks • Authentic Flavors
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
          Food for Soul
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Experience authentic home-cooked meals from certified local cooks in your neighborhood. 
          Every dish tells a story, every cook is verified.
        </p>
        
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2 bg-white rounded-lg shadow-lg p-2">
            <div className="flex-1 flex items-center gap-2 px-4 border-r">
              <MapPin className="h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Enter your address" 
                className="w-full outline-none text-slate-900"
              />
            </div>
            <Button size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Find Food
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span>Verified Cooks</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span>Safety First</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <span>Transparent Profiles</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Cuisines</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Indian', 'Lebanese', 'Vietnamese', 'Italian', 'Mexican', 'Thai', 'Greek', 'Chinese'].map((cuisine) => (
            <Card key={cuisine} className="hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <ChefHat className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">{cuisine}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">1</div>
                <h3 className="font-semibold text-lg mb-2">Find Your Cook</h3>
                <p className="text-slate-600">Browse verified home cooks in your area. Read their stories, check certifications.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">2</div>
                <h3 className="font-semibold text-lg mb-2">Order Fresh Meals</h3>
                <p className="text-slate-600">Choose from daily menus. Pre-order or get same-day delivery from your neighborhood.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center text-xl font-bold">3</div>
                <h3 className="font-semibold text-lg mb-2">Enjoy & Review</h3>
                <p className="text-slate-600">Savor authentic home cooking. Share your experience and support local cooks.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="bg-primary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Are You a Home Cook?</h2>
          <p className="text-lg mb-6 opacity-90">
            Turn your passion into income. Join our community of certified home cooks and share your culinary heritage.
          </p>
          <Link href="/auth/sign-up?role=cook">
            <Button size="lg" variant="secondary">
              Become a Cook
            </Button>
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ChefHat className="h-6 w-6" />
                <span className="text-xl font-bold">LunchBox</span>
              </div>
              <p className="text-slate-400">Food for Soul</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Customers</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/how-it-works">How it Works</Link></li>
                <li><Link href="/cooks">Browse Cooks</Link></li>
                <li><Link href="/menu">Menu</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Cooks</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/how-it-works">Become a Cook</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/safety">Safety Standards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/safety">Safety</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 LunchBox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
