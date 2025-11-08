import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail, Linkedin, Github, Award } from 'lucide-react';
import { link } from 'fs';

const Members = () => {
  const [selectedRole, setSelectedRole] = useState('all');

  const teamMembers = [
    // 4th Year Members (8 total)
    // Leadership and Senior Technical Roles
    
    {
      name: "Kushal MV",
      role: "Captain",
      year: "4th Year",
      major: "- Mechanical Engineering",
      bio: "1SI23ME426",
      email: "kushalmvkushi2@gmail.com",
      linkedin: "Kushal MV",
      category: "leadership"
    },
    {
      name: "Tejashree P",
      role: "Vice Captain",
      year: "4th Year",
      major: "- Mechanical Engineering",
      bio: "1SI22ME059",
      email: "tejashree62005@gmail.com",
      linkedin: "marcusrodriguez",
      category: "leadership"
    },
    {
      name: "Basavraj L Arakeri",
      role: "Breaks Lead",
      year: "4th Year",
      major: "- Mechanical Engineering",
      bio: "1SI22ME008",
      email: "basavrajarakeri20@gmail.com",
      linkedin: "mariagarcia",
      category: "technical"
    },
    {
      name: "Kushal NS",
      role: "Steering",
      year: "4th Year",
      major: "- Mechanical Engineering",
      bio: "1SI22ME021",
      email: "kushalns32@gmail.com",
      linkedin: "emmawhite",
      category: "technical"
    },
    {
      name: "Karthik K",
      role: "Transmission",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "1SI22ME020",
      email: "karthikkkantharaju28@gmail.com",
      linkedin: "jordantaylor",
      category: "technical"
    },
    {
      name: "Vivek Hiremansor",
      role: "Training Director",
      year: "4th Year",
      major: "Education Engineering",
      bio: "Develops and implements team training programs.",
      achievements: ["Training Excellence Award"],
      email: "samuel.m@velotechatv.edu",
      github: "samuelmartinez",
      category: "operations"
    },
    {
      name: "Aisha Patel",
      role: "Sponsorship Director",
      year: "4th Year",
      major: "Business Administration",
      bio: "Develops and maintains sponsor relationships.",
      achievements: ["Sponsorship Growth Award"],
      email: "aisha.p@velotechatv.edu",
      linkedin: "aishapatel",
      category: "operations"
    },
    {
      name: "Michael Patel",
      role: "Innovation Director",
      year: "4th Year",
      major: "Robotics Engineering",
      bio: "Driving technological innovation and research initiatives.",
      achievements: ["Innovation Excellence", "Research Leadership"],
      email: "michael.p@velotechatv.edu",
      github: "michaelpatel",
      category: "leadership"
    },

    // 3rd Year Members (14 total)
    {
      name: "Emily Chen",
      role: "Technical Lead",
      year: "3rd Year",
      major: "Electrical Engineering",
      bio: "Expert in electronic systems and control mechanisms for ATVs.",
      achievements: ["Best Electronic Design", "Innovation Scholarship"],
      email: "emily.c@velotechatv.edu",
      linkedin: "emilychen",
      category: "technical"
    },
    {
      name: "James Wilson",
      role: "Suspension Engineer",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "Specializes in suspension design and optimization.",
      achievements: ["Suspension Innovation Award"],
      email: "james.w@velotechatv.edu",
      linkedin: "jameswilson",
      category: "technical"
    },
    {
      name: "Daniel Lee",
      role: "Software Engineer",
      year: "3rd Year",
      major: "Computer Engineering",
      bio: "Develops control software and data acquisition systems.",
      achievements: ["Software Innovation Award"],
      email: "daniel.l@velotechatv.edu",
      github: "daniellee",
      category: "technical"
    },
    {
      name: "Olivia Chen",
      role: "Systems Engineer",
      year: "3rd Year",
      major: "Systems Engineering",
      bio: "Integrates various subsystems and ensures compatibility.",
      achievements: ["Systems Integration Award"],
      email: "olivia.c@velotechatv.edu",
      linkedin: "oliviachen",
      category: "technical"
    },
    {
      name: "Nathan Park",
      role: "Controls Engineer",
      year: "3rd Year",
      major: "Control Systems Engineering",
      bio: "Develops vehicle control algorithms and stability systems.",
      achievements: ["Control Systems Excellence"],
      email: "nathan.p@velotechatv.edu",
      github: "nathanpark",
      category: "technical"
    },
    {
      name: "William Zhang",
      role: "CAD Engineer",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "Creates detailed 3D models and technical drawings.",
      achievements: ["CAD Design Excellence"],
      email: "william.z@velotechatv.edu",
      github: "williamzhang",
      category: "technical"
    },
    {
      name: "Lisa Park",
      role: "Finance Manager",
      year: "3rd Year",
      major: "Business Engineering",
      bio: "Manages club budget and fundraising initiatives.",
      achievements: ["Financial Management Excellence"],
      email: "lisa.p@velotechatv.edu",
      linkedin: "lisapark",
      category: "operations"
    },
    {
      name: "Thomas Anderson",
      role: "Logistics Coordinator",
      year: "3rd Year",
      major: "Supply Chain Management",
      bio: "Manages parts inventory and supply chain.",
      achievements: ["Logistics Excellence"],
      email: "thomas.a@velotechatv.edu",
      github: "thomasanderson",
      category: "operations"
    },
    {
      name: "Victoria Chang",
      role: "Compliance Officer",
      year: "3rd Year",
      major: "Engineering Management",
      bio: "Ensures adherence to competition rules and regulations.",
      achievements: ["Compliance Excellence"],
      email: "victoria.c@velotechatv.edu",
      linkedin: "victoriachang",
      category: "operations"
    },
    {
      name: "Grace Wilson",
      role: "Sustainability Officer",
      year: "3rd Year",
      major: "Environmental Engineering",
      bio: "Implements sustainable practices in operations.",
      achievements: ["Sustainability Innovation"],
      email: "grace.w@velotechatv.edu",
      linkedin: "gracewilson",
      category: "operations"
    },
    {
      name: "Carlos Rivera",
      role: "Events Coordinator",
      year: "3rd Year",
      major: "Project Management",
      bio: "Organizes team events and competition logistics.",
      achievements: ["Event Management Excellence"],
      email: "carlos.r@velotechatv.edu",
      linkedin: "carlosrivera",
      category: "operations"
    },
    {
      name: "Lucas Santos",
      role: "Aerodynamics Engineer",
      year: "3rd Year",
      major: "Aerospace Engineering",
      bio: "Optimizes vehicle aerodynamics through CFD analysis.",
      achievements: ["Aero Design Excellence"],
      email: "lucas.s@velotechatv.edu",
      github: "lucassantos",
      category: "technical"
    },
    {
      name: "Sophia Lee",
      role: "Electronics Engineer",
      year: "3rd Year",
      major: "Electrical Engineering",
      bio: "Designs and implements electronic control systems.",
      achievements: ["Circuit Design Excellence"],
      email: "sophia.l@velotechatv.edu",
      github: "sophialee",
      category: "technical"
    },
    {
      name: "Ryan Martinez",
      role: "Manufacturing Lead",
      year: "3rd Year",
      major: "Manufacturing Engineering",
      bio: "Oversees fabrication processes and quality control.",
      achievements: ["Manufacturing Innovation Award"],
      email: "ryan.m@velotechatv.edu",
      github: "ryanmartinez",
      category: "technical"
    },

    // 2nd Year Members (8 total)
    {
      name: "David Kim",
      role: "Design Engineer",
      year: "2nd Year",
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
      year: "2nd Year",
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
      year: "2nd Year",
      major: "Mechanical Engineering",
      bio: "Ensures all safety protocols and testing procedures are followed.",
      achievements: ["Safety Excellence Recognition"],
      email: "alex.t@velotechatv.edu",
      category: "operations"
    },
    {
      name: "Hannah Kim",
      role: "Documentation Manager",
      year: "2nd Year",
      major: "Technical Writing",
      bio: "Maintains technical documentation and team records.",
      achievements: ["Documentation Excellence"],
      email: "hannah.k@velotechatv.edu",
      linkedin: "hannahkim",
      category: "operations"
    },
    {
      name: "Maya Singh",
      role: "Community Outreach",
      year: "2nd Year",
      major: "Communications",
      bio: "Coordinates community engagement and educational programs.",
      achievements: ["Community Impact Award"],
      email: "maya.s@velotechatv.edu",
      linkedin: "mayasingh",
      category: "operations"
    },
    {
      name: "Kevin Brown",
      role: "Test Engineer",
      year: "2nd Year",
      major: "Mechanical Engineering",
      bio: "Conducts performance testing and data analysis.",
      achievements: ["Testing Innovation Award"],
      email: "kevin.b@velotechatv.edu",
      category: "technical"
    },
    {
      name: "Isabella Romano",
      role: "Test Engineer",
      year: "2nd Year",
      major: "Mechanical Engineering",
      bio: "Conducts vehicle testing and performance analysis.",
      achievements: ["Testing Excellence"],
      email: "isabella.r@velotechatv.edu",
      linkedin: "isabellaromano",
      category: "technical"
    },
    {
      name: "Raj Patel",
      role: "Data Analyst",
      year: "2nd Year",
      major: "Data Science",
      bio: "Analyzes vehicle performance data and testing results.",
      achievements: ["Data Analysis Excellence"],
      email: "raj.p@velotechatv.edu",
      github: "rajpatel",
      category: "technical"
    },
    {
      name: "Amy Chen",
      role: "Component Engineer",
      year: "2nd Year",
      major: "Mechanical Engineering",
      bio: "Designs and tests individual vehicle components.",
      achievements: ["Component Design Award"],
      email: "amy.c@velotechatv.edu",
      linkedin: "amychen",
      category: "technical"
    },
    {
      name: "Tyler Wilson",
      role: "Workshop Technician",
      year: "1st Year",
      major: "Manufacturing Technology",
      bio: "Maintains workshop equipment and assists in fabrication.",
      achievements: ["Technical Excellence"],
      email: "tyler.w@velotechatv.edu",
      github: "tylerwilson",
      category: "operations"
    },
    {
      name: "Sarah Lee",
      role: "Quality Control Assistant",
      year: "1st Year",
      major: "Quality Engineering",
      bio: "Ensures quality standards in manufacturing and assembly.",
      achievements: ["Quality Excellence"],
      email: "sarah.l@velotechatv.edu",
      linkedin: "sarahlee",
      category: "operations"
    },
    {
      name: "Marco Ferrari",
      role: "Dynamics Engineer",
      year: "2nd Year",
      major: "Mechanical Engineering",
      bio: "Studies vehicle dynamics and handling characteristics.",
      achievements: ["Dynamics Innovation"],
      email: "marco.f@velotechatv.edu",
      github: "marcoferrari",
      category: "technical"
    },
    {
      name: "Lily Zhang",
      role: "UI/UX Designer",
      year: "2nd Year",
      major: "Design Engineering",
      bio: "Designs user interfaces for vehicle control systems.",
      achievements: ["UI Design Excellence"],
      email: "lily.z@velotechatv.edu",
      linkedin: "lilyzhang",
      category: "technical"
    },
    {
      name: "Benjamin Foster",
      role: "Resource Coordinator",
      year: "2nd Year",
      major: "Industrial Engineering",
      bio: "Manages team resources and equipment allocation.",
      achievements: ["Resource Management Award"],
      email: "benjamin.f@velotechatv.edu",
      github: "benjaminfoster",
      category: "operations"
    },
    {
      name: "Priya Sharma",
      role: "Communications Officer",
      year: "2nd Year",
      major: "Communications Engineering",
      bio: "Handles internal team communications and documentation.",
      achievements: ["Communication Excellence"],
      email: "priya.s@velotechatv.edu",
      linkedin: "priyasharma",
      category: "operations"
    },

    // 1st Year Members (7 total)
    {
      name: "Alex Chen",
      role: "Junior Engineer",
      year: "1st Year",
      major: "Mechanical Engineering",
      bio: "Eager learner focusing on ATV chassis and suspension systems.",
      achievements: ["First-Year Excellence Award"],
      email: "alex.c@velotechatv.edu",
      github: "alexchen",
      category: "technical"
    },
    {
      name: "Rachel Thompson",
      role: "Design Assistant",
      year: "1st Year",
      major: "Industrial Design",
      bio: "Supporting the design team with fresh perspectives and innovative ideas.",
      achievements: ["Design Innovation Award"],
      email: "rachel.t@velotechatv.edu",
      linkedin: "rachelthompson",
      category: "technical"
    },
    {
      name: "Miguel Santos",
      role: "Workshop Assistant",
      year: "1st Year",
      major: "Manufacturing Engineering",
      bio: "Assisting with fabrication and assembly of ATV components.",
      achievements: ["Workshop Safety Excellence"],
      email: "miguel.s@velotechatv.edu",
      github: "miguelsantos",
      category: "operations"
    },
    {
      name: "Emma Davis",
      role: "Documentation Assistant",
      year: "1st Year",
      major: "Technical Writing",
      bio: "Supporting the team with technical documentation and reports.",
      achievements: ["Documentation Initiative Award"],
      email: "emma.d@velotechatv.edu",
      linkedin: "emmadavis",
      category: "operations"
    },
    {
      name: "Kai Patel",
      role: "Software Assistant",
      year: "1st Year",
      major: "Computer Science",
      bio: "Contributing to software development and data analysis.",
      achievements: ["Programming Excellence"],
      email: "kai.p@velotechatv.edu",
      github: "kaipatel",
      category: "technical"
    },
    {
      name: "Sofia Rodriguez",
      role: "Marketing Assistant",
      year: "1st Year",
      major: "Marketing",
      bio: "Supporting team outreach and social media presence.",
      achievements: ["Social Media Innovation"],
      email: "sofia.r@velotechatv.edu",
      linkedin: "sofiarodriguez",
      category: "operations"
    },
    {
      name: "James Lee",
      role: "Testing Assistant",
      year: "1st Year",
      major: "Mechanical Engineering",
      bio: "Supporting vehicle testing and performance analysis.",
      achievements: ["Testing Protocol Excellence"],
      email: "james.l@velotechatv.edu",
      github: "jameslee",
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
                        {member.year}  {member.major}
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
