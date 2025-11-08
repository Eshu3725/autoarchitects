import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mail } from 'lucide-react';

const Members = () => {
  const [selectedRole, setSelectedRole] = useState('all');

  const teamMembers = [
    // Leadership Team
    {
      name: "Kushal M.V",
      role: "Captain (Steering)",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME046",
      email: "kushalmvkushi2@gmail.com",
      category: "leadership"
    },
    {
      name: "Tejashree P",
      role: "Lead (Chassis) CAE",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME059",
      email: "tejashree3005@gmail.com",
      category: "leadership"
    },

    // Steering Team
    {
      name: "Kushal N.S",
      role: "Steering",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME021",
      email: "kushalns32@gmail.com",
      category: "technical"
    },
    {
      name: "Inchara M.K",
      role: "Steering",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME039",
      email: "incharakswamy31@gmail.com",
      category: "technical"
    },
    {
      name: "Siddharth S.",
      role: "Steering",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME093",
      email: "siddarth.s7090@gmail.com",
      category: "technical"
    },
    {
      name: "Veeresh",
      role: "Steering",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME108",
      email: "veereshsg14@gmail.com",
      category: "technical"
    },
    {
      name: "Dhanush gowda",
      role: "Steering",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME025",
      email: "dhanushgowdaa@gmail.com",
      category: "technical"
    },

    // Transmission Team
    {
      name: "Karthik K",
      role: "Transmission",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME020",
      email: "karthikkkantharaju@gmail.com",
      category: "technical"
    },
    {
      name: "Karthik S",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME046",
      email: "karthikarthik1937@gmail.com",
      category: "technical"
    },
    {
      name: "Sharadhasimha",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME084",
      email: "sharadhasimnachina@gmail.com",
      category: "technical"
    },
    {
      name: "Dimple K",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME026",
      email: "dimplek8580@gmail.com",
      category: "technical"
    },
    {
      name: "Manoj D",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME010",
      email: "manojyadav31@gmail.com",
      category: "technical"
    },

    // Suspension Team
    {
      name: "Likith H",
      role: "Suspension",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME023",
      email: "likith.785@gmail.com",
      category: "technical"
    },
    {
      name: "Skanda Moguda",
      role: "Suspension",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME052",
      email: "skandamoguda@gmail.com",
      category: "technical"
    },
    {
      name: "Mithun Yadav M.R",
      role: "Suspension",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME047",
      email: "mithunyadav72@gmail.com",
      category: "technical"
    },
    {
      name: "Prathik Jain T.N",
      role: "Suspension",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME012",
      email: "prathikjaintn21@gmail.com",
      category: "technical"
    },
    {
      name: "Vivek J",
      role: "Suspension",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME070",
      email: "vivek838466@gmail.com",
      category: "technical"
    },
    {
      name: "Jaswanth D.",
      role: "Suspension",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME011",
      email: "jaswanthd150@gmail.com",
      category: "technical"
    },

    // Brakes Team
    {
      name: "Basavaraj L Arakeri",
      role: "Brakes (Lead)",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME081",
      email: "basavrajarakeri20@gmail.com",
      category: "technical"
    },
    {
      name: "Vivek Hiresomannavar",
      role: "Brakes",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME067",
      email: "vivekhiresomannavar@gmail.com",
      category: "technical"
    },
    {
      name: "Medha D.",
      role: "Brakes",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME055",
      email: "dmedha2005@gmail.com",
      category: "technical"
    },
    {
      name: "Mohammed Umar Siddiq",
      role: "Brakes",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME059",
      email: "mdumarsiddiq50@gmail.com",
      category: "technical"
    },
    {
      name: "Sumanth Honmunger",
      role: "Brakes",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME102",
      email: "sumanthhonmunger@gmail.com",
      category: "technical"
    },
    {
      name: "Shashikumar",
      role: "Brakes",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME053",
      email: "shashi600325@gmail.com",
      category: "technical"
    },
    {
      name: "Kavana U",
      role: "Brakes",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME081",
      email: "kavana688@gmail.com",
      category: "technical"
    },

    // CAE (Chassis) Team
    {
      name: "Damaneet",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME014",
      email: "damaneet712@gmail.com",
      category: "technical"
    },
    {
      name: "Yashas M.S",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME015",
      email: "yashasm9125@gmail.com",
      category: "technical"
    },
    {
      name: "Darshan H.S",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME016",
      email: "darshanvaibhav2@gmail.com",
      category: "technical"
    },
    {
      name: "Dr.Kamlesh D.R",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME074",
      email: "drkamlesh17@gmail.com",
      category: "technical"
    },
    {
      name: "Nikshit J.",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME075",
      email: "nikshitjagadeesh@gmail.com",
      category: "technical"
    },
    {
      name: "Pallav B",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME078",
      email: "pallavpallu8206@gmail.com",
      category: "technical"
    },
    {
      name: "Pavan H.S",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME080",
      email: "pavanhsnaik2806@gmail.com",
      category: "technical"
    },


    // Graphics Team
    {
      name: "Eshaan AV",
      role: "Digital",
      year: "3rd Year",
      major: "Artificial Intelligence and data science",
      bio: "USN: 1SI23AD011",
      email: "eshaanvenkatesh3725@gmail.com",
      category: "operations"
    },
    {
      name: "Bhumika B.R",
      role: "Graphics",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI24ME034",
      email: "b301898@gmail.com",
      category: "operations"
    },

    // Transmission Lead
    {
      name: "Shivaprakash T.P",
      role: "Transmission (Lead)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME089",
      email: "shivaprakashtp12@gmail.com",
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

                    {/* Contact Links */}
                    <div className="flex justify-center pt-4 border-t border-border">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 bg-steel/10 rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-smooth group"
                      >
                        <Mail className="w-5 h-5 text-steel group-hover:text-white" />
                      </a>
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
