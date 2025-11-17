import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { StudentRegistrationInsert } from '@/types/registration';
import AnimatedATV from './AnimatedATV';

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  usn: string;
  email: string;
  phone: string;
  role: string;
  partOfOtherClub: string;
  otherClubName: string;
}

interface FormErrors {
  name?: string;
  usn?: string;
  email?: string;
  phone?: string;
  role?: string;
  otherClubName?: string;
}

const RegistrationModal = ({ open, onOpenChange }: RegistrationModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    usn: '',
    email: '',
    phone: '',
    role: '',
    partOfOtherClub: 'no',
    otherClubName: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Available roles based on the Members page
  const roles = [
    'Leadership',
    'Steering',
    'Transmission',
    'Suspension',
    'Brakes',
    'Chassis/CAE',
    'Digital',
    'Graphics',
  ];

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFormData({
          name: '',
          usn: '',
          email: '',
          phone: '',
          role: '',
          partOfOtherClub: 'no',
          otherClubName: '',
        });
        setErrors({});
        setShowSuccess(false);
      }, 300);
    }
  }, [open]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Indian phone number: 10 digits, optionally starting with +91 or 0
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.usn.trim()) {
      newErrors.usn = 'USN is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    if (formData.partOfOtherClub === 'yes' && !formData.otherClubName.trim()) {
      newErrors.otherClubName = 'Please specify the club name';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare registration data for Supabase
      const registrationData: StudentRegistrationInsert = {
        name: formData.name,
        usn: formData.usn,
        email: formData.email,
        phone: formData.phone,
        role_interested: formData.role,
        part_of_other_club: formData.partOfOtherClub as 'yes' | 'no',
        other_club_name: formData.partOfOtherClub === 'yes' ? formData.otherClubName : null,
        status: 'Pending',
      };

      // Insert registration into Supabase
      const { data, error } = await supabase
        .from('student_registrations')
        .insert([registrationData])
        .select();

      if (error) {
        console.error('Supabase Error:', error);
        throw error;
      }

      console.log('Registration saved successfully:', data);

      // Show success state
      setShowSuccess(true);
      toast({
        title: 'Registration Successful!',
        description: 'Your registration has been submitted. We\'ll contact you soon!',
      });

      // Close modal after 2.5 seconds
      setTimeout(() => {
        onOpenChange(false);
      }, 2500);

    } catch (error: any) {
      console.error('Database Error:', {
        error,
        message: error?.message || 'Unknown error',
        details: error?.details,
        hint: error?.hint,
      });

      toast({
        title: 'Submission Failed',
        description: error?.message || 'There was an error submitting your registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1100px] max-h-[90vh] overflow-hidden glass-card border-2 border-white/20 shadow-2xl p-0">
        <div className="flex flex-col lg:flex-row max-h-[90vh]">
          {/* Left Side - Animated ATV (Hidden on mobile, visible on desktop) */}
          <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-steel-dark via-steel to-metallic p-8 items-center justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-energy rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>

            {/* ATV Animation Container */}
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
              <div className="mb-6 text-center">
                <h3 className="font-display font-bold text-3xl text-white mb-2">
                  Rev Up Your <span className="text-energy">Future</span>
                </h3>
                <p className="text-white/80 text-sm">
                  Join the ultimate ATV engineering experience
                </p>
              </div>

              <div className="w-full max-w-md h-64 animate-fade-in-up">
                <AnimatedATV />
              </div>

              {/* Stats or Features */}
              <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
                <div className="text-center glass-card p-3 rounded-lg border border-white/10">
                  <div className="font-display font-bold text-2xl text-energy">50+</div>
                  <div className="text-white/70 text-xs">Members</div>
                </div>
                <div className="text-center glass-card p-3 rounded-lg border border-white/10">
                  <div className="font-display font-bold text-2xl text-energy">10+</div>
                  <div className="text-white/70 text-xs">Projects</div>
                </div>
                <div className="text-center glass-card p-3 rounded-lg border border-white/10">
                  <div className="font-display font-bold text-2xl text-energy">5+</div>
                  <div className="text-white/70 text-xs">Awards</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full lg:w-[55%] overflow-y-auto p-6 sm:p-8 scroll-smooth">
            {/* Mobile ATV Animation - Only visible on mobile */}
            <div className="lg:hidden mb-6 h-40 bg-gradient-to-br from-steel-dark/10 via-steel/10 to-metallic/10 rounded-xl p-4 border border-steel/20">
              <AnimatedATV />
            </div>

            <DialogHeader className="mb-6">
              <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-steel-dark">
                Join <span className="text-gradient-energy">AutoArchitects</span>
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground">
                Fill out the form below to register for the ATV Club. We'll get back to you soon!
              </DialogDescription>
            </DialogHeader>

            {showSuccess ? (
              <div className="py-12 text-center animate-fade-in-up">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-energy/20 rounded-full blur-xl animate-pulse" />
                  <CheckCircle2 className="w-20 h-20 text-energy mx-auto relative z-10" />
                </div>
                <h3 className="font-display font-bold text-2xl text-steel-dark mb-3">
                  Registration Successful!
                </h3>
                <p className="text-muted-foreground text-lg">
                  Thank you for your interest. We'll contact you soon!
                </p>
              </div>
            ) : (
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-steel-dark font-semibold">
                Name <span className="text-energy">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                  errors.name ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* USN Field */}
            <div className="space-y-2">
              <Label htmlFor="usn" className="text-steel-dark font-semibold">
                USN (University Serial Number) <span className="text-energy">*</span>
              </Label>
              <Input
                id="usn"
                type="text"
                placeholder="e.g., 1SI23ME426"
                value={formData.usn}
                onChange={(e) => handleInputChange('usn', e.target.value.toUpperCase())}
                className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                  errors.usn ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.usn && (
                <p className="text-sm text-red-500 mt-1">{errors.usn}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-steel-dark font-semibold">
                Email ID <span className="text-energy">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-steel-dark font-semibold">
                Phone Number <span className="text-energy">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 9876543210"
                value={formData.phone}
                onChange={(e) => {
                  // Allow only numeric input
                  const value = e.target.value.replace(/\D/g, '');
                  // Limit to 10 digits
                  if (value.length <= 10) {
                    handleInputChange('phone', value);
                  }
                }}
                maxLength={10}
                className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                  errors.phone ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-steel-dark font-semibold">
                Role Interested In <span className="text-energy">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <SelectTrigger
                  className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                    errors.role ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role}</p>
              )}
            </div>

            {/* Part of Other Club */}
            <div className="space-y-3">
              <Label className="text-steel-dark font-semibold">
                Are you part of any other club? <span className="text-energy">*</span>
              </Label>
              <RadioGroup
                value={formData.partOfOtherClub}
                onValueChange={(value) => {
                  handleInputChange('partOfOtherClub', value);
                  if (value === 'no') {
                    handleInputChange('otherClubName', '');
                  }
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>

              {/* Conditional Club Name Field */}
              {formData.partOfOtherClub === 'yes' && (
                <div className="space-y-2 animate-fade-in-up pt-2">
                  <Label htmlFor="otherClubName" className="text-steel-dark font-semibold">
                    Which club? <span className="text-energy">*</span>
                  </Label>
                  <Input
                    id="otherClubName"
                    type="text"
                    placeholder="Enter club name"
                    value={formData.otherClubName}
                    onChange={(e) => handleInputChange('otherClubName', e.target.value)}
                    className={`h-11 border-steel/20 focus:border-energy focus:ring-energy/20 transition-smooth ${
                      errors.otherClubName ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.otherClubName && (
                    <p className="text-sm text-red-500 mt-1">{errors.otherClubName}</p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="flex-1 h-12 border-steel/20 hover:bg-steel/5 transition-smooth"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 energy-gradient hover-glow hover-shine transition-smooth font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </Button>
            </div>
          </form>
        )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;

