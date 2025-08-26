import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Settings, LogOut, User, Mail, Phone, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useChatStore } from '../../store/chatStore';

interface UserProfileProps {
  onClose: () => void;
}

export function UserProfile({ onClose }: UserProfileProps) {
  const { currentUser, logout } = useChatStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('+1 (555) 123-4567');

  const handleSave = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-card rounded-2xl w-full max-w-md shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Profile</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full p-2"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-card online-indicator" />
              </div>
              
              {!isEditing ? (
                <div className="text-center">
                  <h3 className="font-semibold text-foreground">{currentUser?.name}</h3>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <div className="relative">
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Contact Information</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-foreground">{currentUser?.email}</p>
                        <p className="text-xs text-muted-foreground">Email</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="tel"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-foreground">{phone}</p>
                        <p className="text-xs text-muted-foreground">Phone</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isEditing ? (
                <div className="flex space-x-3">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}