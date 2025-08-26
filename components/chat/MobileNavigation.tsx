'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, LogOut, Settings, User, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  onSearchToggle: () => void;
  onLogout: () => void;
}

export function MobileNavigation({ 
  isOpen, 
  onToggle, 
  onSearchToggle, 
  onLogout 
}: MobileNavigationProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleAboutClick = () => {
    router.push('/about');
  };

  return (
    <div className="md:hidden">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <h1 className="font-semibold text-gray-900">ChatApp</h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSearchToggle}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex-1 py-6">
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleProfileClick}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Button>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={handleAboutClick}
                      >
                        <Info className="mr-3 h-4 w-4" />
                        About
                      </Button>
                    </nav>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={onLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </div>
  );
}