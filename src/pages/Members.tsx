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
      name: "Darshan H.S",
      role: "Transmission (Lead)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME016",
      email: "darshanvaibhav2@gmail.com",
      category: "technical"
    },
    {
      name: "Shivaprakash T.P",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME089",
      email: "shivaprakashtp12@gmail.com",
      category: "technical"
    },
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
      name: "Damaresh",
      role: "Transmission",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME014",
      email: "damaresh712@gmail.com",
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
    

    // Suspension Team
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
      name: "Likith H",
      role: "Suspension",
      year: "4th Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI22ME023",
      email: "likith.785@gmail.com",
      category: "technical"
    },
    {
      name: "Manoj G",
      role: "Suspension",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME010",
      email: "manojyadav31@gmail.com",
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
      name: "Yashas M.S",
      role: "CAE (Chassis)",
      year: "3rd Year",
      major: "Mechanical Engineering",
      bio: "USN: 1SI23ME015",
      email: "yashasm9125@gmail.com",
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
      major: "Computer science and Engineering",
      bio: "USN: 1SI24ME034",
      email: "b301898@gmail.com",
      category: "operations"
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
      <section className="relative hero-gradient py-24 md:py-32 text-white overflow-hidden">
        {/* Animated background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-energy rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 animate-scale-in">
            <div className="relative">
              <div className="absolute inset-0 bg-energy/30 rounded-full blur-2xl" />
              <Users className="w-20 h-20 mx-auto text-energy relative z-10" />
            </div>
          </div>
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in-up">
            Our <span className="text-gradient-energy">Team</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Meet the passionate engineers and innovators driving AutoArchitects forward
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/20 border-b border-border/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {roleCategories.map((category, index) => (
              <Button
                key={category.id}
                variant={selectedRole === category.id ? "default" : "outline"}
                onClick={() => setSelectedRole(category.id)}
                className={`transition-all duration-300 hover-scale animate-fade-in delay-${index * 100} ${
                  selectedRole === category.id
                    ? 'energy-gradient text-white shadow-glow scale-105'
                    : 'glass-card border-steel/20 text-steel hover:bg-energy/10 hover:text-energy hover:border-energy/30'
                }`}
              >
                {category.name} <span className="ml-1 opacity-70">({category.count})</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-24 bg-gradient-to-b from-muted/30 via-background to-muted/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-energy rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMembers.map((member, index) => (
              <Card key={index} className="group glass-card border-2 border-white/10 shadow-2xl hover-lift transition-all duration-500 overflow-hidden hover:border-energy/30 hover:shadow-energy/10 animate-scale-in" style={{ animationDelay: `${(index % 9) * 0.1}s` }}>
                <CardContent className="p-0">
                  {/* Avatar Section */}
                  <div className="h-52 metallic-gradient flex items-center justify-center relative overflow-hidden">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-energy/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <div className="relative z-10">
                      <div className="w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 group-hover:border-energy/50 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                        <span className="font-display font-bold text-4xl text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-steel-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  </div>

                  {/* Content Section */}
                  <div className="p-6 bg-gradient-to-b from-background/95 to-background">
                    <div className="text-center mb-4">
                      <h3 className="font-display font-bold text-xl text-steel-dark mb-2 group-hover:text-energy transition-colors">
                        {member.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className={`mb-3 font-semibold transition-all duration-300 ${
                          getRoleColor(member.role) === 'energy'
                            ? 'bg-energy/10 text-energy border border-energy/20 group-hover:bg-energy group-hover:text-white'
                            : getRoleColor(member.role) === 'steel'
                            ? 'bg-steel/10 text-steel border border-steel/20 group-hover:bg-steel group-hover:text-white'
                            : 'bg-metallic/10 text-metallic border border-metallic/20 group-hover:bg-metallic group-hover:text-white'
                        }`}
                      >
                        {member.role}
                      </Badge>
                      <p className="text-sm text-muted-foreground font-medium">
                        {member.year} • {member.major}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center mb-4 leading-relaxed">
                      {member.bio}
                    </p>

                    {/* Contact Links */}
                    <div className="flex justify-center pt-4 border-t border-border/50">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-energy hover-glow transition-all duration-300 group/btn border border-white/20 hover:border-energy/50 hover:scale-110"
                      >
                        <Mail className="w-5 h-5 text-steel group-hover/btn:text-white transition-colors" />
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
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-steel-dark via-steel to-metallic overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-energy rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card p-12 md:p-16 rounded-3xl border-2 border-white/20 shadow-2xl animate-scale-in">
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Join Our <span className="text-gradient-energy">Team</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ready to be part of something amazing? We're always looking for passionate
              engineers and innovators to join our mission.
            </p>
            <Button size="lg" className="energy-gradient hover-glow hover-shine transition-all duration-300 text-lg px-10 py-7 font-semibold shadow-2xl hover:scale-105">
              <Mail className="mr-2 w-6 h-6" />
              Contact Us to Join
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Members;
