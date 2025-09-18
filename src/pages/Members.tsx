import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Linkedin, Github, Award } from 'lucide-react';

const Members = () => {
  const [selectedRole, setSelectedRole] = useState('all');

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "President",
      year: "Senior",
      major: "Mechanical Engineering",
      bio: "Leading the team with passion for innovation and competitive racing.",
      achievements: ["National Competition Winner", "Design Excellence Award"],
      email: "sarah.j@velotechatv.edu",
      linkedin: "sarahjohnson",
      category: "leadership"
    },
    {
      name: "Marcus Rodriguez",
      role: "Vice President",
      year: "Senior", 
      major: "Automotive Engineering",
      bio: "Specializes in engine optimization and performance tuning.",
      achievements: ["Engine Innovation Award", "Technical Leadership"],
      email: "marcus.r@velotechatv.edu",
      github: "marcusrodriguez",
      category: "leadership"
    },
    {
      name: "Emily Chen",
      role: "Technical Lead",
      year: "Junior",
      major: "Electrical Engineering",
      bio: "Expert in electronic systems and control mechanisms for ATVs.",
      achievements: ["Best Electronic Design", "Innovation Scholarship"],
      email: "emily.c@velotechatv.edu",
      linkedin: "emilychen",
      category: "technical"
    },
    {
      name: "David Kim",
      role: "Design Engineer",
      year: "Junior",
      major: "Mechanical Engineering", 
      bio: "CAD specialist focusing on chassis design and aerodynamics.",
      achievements: ["Design Competition Winner"],
      email: "david.k@velotechatv.edu",
      github: "davidkim",
      category: "technical"
    },
    {
      name: "Jessica Wang",
      role: "Marketing Director",
      year: "Sophomore",
      major: "Industrial Engineering",
      bio: "Manages club communications and sponsor relationships.",
      achievements: ["Outstanding Leadership Award"],
      email: "jessica.w@velotechatv.edu",
      linkedin: "jessicawang",
      category: "operations"
    },
    {
      name: "Alex Thompson",
      role: "Safety Officer",
      year: "Sophomore", 
      major: "Mechanical Engineering",
      bio: "Ensures all safety protocols and testing procedures are followed.",
      achievements: ["Safety Excellence Recognition"],
      email: "alex.t@velotechatv.edu",
      category: "operations"
    },
    {
      name: "Ryan Martinez",
      role: "Manufacturing Lead",
      year: "Senior",
      major: "Manufacturing Engineering",
      bio: "Oversees fabrication processes and quality control.",
      achievements: ["Manufacturing Innovation Award"],
      email: "ryan.m@velotechatv.edu",
      github: "ryanmartinez",
      category: "technical"
    },
    {
      name: "Lisa Park",
      role: "Finance Manager",
      year: "Junior",
      major: "Business Engineering",
      bio: "Manages club budget and fundraising initiatives.",
      achievements: ["Financial Management Excellence"],
      email: "lisa.p@velotechatv.edu",
      linkedin: "lisapark",
      category: "operations"
    },
    {
      name: "Kevin Brown",
      role: "Test Engineer",
      year: "Sophomore",
      major: "Mechanical Engineering",
      bio: "Conducts performance testing and data analysis.",
      achievements: ["Testing Innovation Award"],
      email: "kevin.b@velotechatv.edu",
      category: "technical"
    }
  ];

  const roleCategories = [
    { id: 'all', name: 'All Members', count: teamMembers.length },
    { id: 'leadership', name: 'Leadership', count: teamMembers.filter(m => m.category === 'leadership').length },
    { id: 'technical', name: 'Technical Team', count: teamMembers.filter(m => m.category === 'technical').length },
    { id: 'operations', name: 'Operations', count: teamMembers.filter(m => m.category === 'operations').length },
  ];

  const filteredMembers = selectedRole === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === selectedRole);

  const getRoleColor = (role: string) => {
    if (role.includes('President')) return 'energy';
    if (role.includes('Lead') || role.includes('Director')) return 'steel';
    return 'metallic';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-6 text-energy" />
          <h1 className="font-display font-bold text-5xl md:text-6xl mb-6">
            Our Team
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Meet the passionate engineers and innovators driving AutoArchitects forward
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {roleCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedRole === category.id ? "default" : "outline"}
                onClick={() => setSelectedRole(category.id)}
                className={`transition-smooth ${
                  selectedRole === category.id 
                    ? 'energy-gradient text-white shadow-glow' 
                    : 'border-steel/30 text-steel hover:bg-steel/10 hover:text-energy'
                }`}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <Card key={index} className="group border-0 shadow-card hover-lift transition-smooth overflow-hidden">
                <CardContent className="p-0">
                  {/* Avatar Section */}
                  <div className="h-48 metallic-gradient flex items-center justify-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-display font-bold text-3xl text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="font-display font-bold text-xl text-steel-dark mb-1">
                        {member.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={`mb-2 ${
                          getRoleColor(member.role) === 'energy' 
                            ? 'bg-energy/10 text-energy' 
                            : getRoleColor(member.role) === 'steel'
                            ? 'bg-steel/10 text-steel'
                            : 'bg-metallic/10 text-metallic'
                        }`}
                      >
                        {member.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {member.year} • {member.major}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {member.bio}
                    </p>

                    {/* Achievements */}
                    {member.achievements && member.achievements.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="w-4 h-4 text-energy mr-1" />
                          <span className="text-xs font-medium text-energy">Achievements</span>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {member.achievements.map((achievement, achIndex) => (
                            <Badge 
                              key={achIndex} 
                              variant="outline" 
                              className="text-xs border-energy/30 text-energy hover:bg-energy/10"
                            >
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contact Links */}
                    <div className="flex justify-center space-x-3 pt-4 border-t border-border">
                      <a 
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 bg-steel/10 rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
                      >
                        <Mail className="w-4 h-4 text-steel group-hover:text-white" />
                      </a>
                      {member.linkedin && (
                        <a 
                          href={`https://linkedin.com/in/${member.linkedin}`}
                          className="w-8 h-8 bg-steel/10 rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 text-steel group-hover:text-white" />
                        </a>
                      )}
                      {member.github && (
                        <a 
                          href={`https://github.com/${member.github}`}
                          className="w-8 h-8 bg-steel/10 rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 text-steel group-hover:text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-steel-dark mb-6">
            Join Our Team
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Ready to be part of something amazing? We're always looking for passionate 
            engineers and innovators to join our mission.
          </p>
          <Button size="lg" className="energy-gradient hover-glow transition-smooth text-lg px-8 py-6">
            <Mail className="mr-2 w-5 h-5" />
            Contact Us to Join
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Members;