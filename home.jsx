import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Server, Shield, Gift, Image as ImageIcon, MessageCircle, Users, Zap, Ban, Heart, Copy, Check, ExternalLink, ChevronDown, Upload, ThumbsUp, Star, Award } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Discord OAuth2 Config
const DISCORD_CLIENT_ID = '1451262371971600477';
const REDIRECT_URI = window.location.origin + '/callback';
const DISCORD_AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=token&scope=identify%20email`;

// Secret codes configuration
const SECRET_CODES = [
  { id: 'lunarjuan', name: 'Lunar Juan', reward: '500 monedas lunares' },
  { id: 'halarmoon', name: 'Halar Moon', reward: 'Kit de inicio VIP' },
  { id: 'craft2026', name: 'Craft 2026', reward: 'Partículas especiales' },
  { id: 'secretluna', name: 'Secret Luna', reward: 'Mascota lunar' },
  { id: 'velocityvip', name: 'Velocity VIP', reward: '3 días de VIP' },
];

// Star particle component
const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let stars = [];
    let meteors = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          opacity: Math.random(),
          speed: Math.random() * 0.02 + 0.01,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
        });
      }
    };

    const createMeteor = () => {
      if (Math.random() < 0.002 && meteors.length < 3) {
        meteors.push({
          x: Math.random() * canvas.width,
          y: 0,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 5,
          opacity: 1,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 31, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkleSpeed *= -1;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Draw meteors
      createMeteor();
      meteors = meteors.filter(meteor => {
        meteor.x += meteor.speed;
        meteor.y += meteor.speed * 0.7;
        meteor.opacity -= 0.01;

        if (meteor.opacity > 0) {
          const gradient = ctx.createLinearGradient(
            meteor.x, meteor.y,
            meteor.x - meteor.length, meteor.y - meteor.length * 0.7
          );
          gradient.addColorStop(0, `rgba(0, 240, 255, ${meteor.opacity})`);
          gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');

          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.length, meteor.y - meteor.length * 0.7);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 2;
          ctx.stroke();
          return true;
        }
        return false;
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// Navbar Component
const Navbar = ({ user, onLogin, onLogout, activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'servidor', label: 'Servidor' },
    { id: 'reglas', label: 'Reglas' },
    { id: 'showcase', label: 'Showcase' },
    { id: 'galeria', label: 'Galería' },
    { id: 'discord', label: 'Discord' },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#0a0a1f]/95 backdrop-blur-md shadow-lg shadow-cyan-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('inicio')}>
            <span className="text-3xl">🌕</span>
            <span className="font-orbitron font-bold text-lg md:text-xl text-white">
              Halar<span className="text-cyan-400">craft</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`font-roboto text-sm uppercase tracking-wider transition-all duration-300 hover:text-cyan-400 ${
                  activeSection === link.id ? 'text-cyan-400' : 'text-gray-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User / Login */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full ring-2 ring-cyan-400"
                />
                <div className="text-sm">
                  <p className="text-white font-medium">{user.username}</p>
                  <p className="text-gray-400 text-xs">{user.email || 'Email oculto'}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#5865F2]/30"
              >
                <MessageCircle className="w-4 h-4" />
                Login Discord
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0a0a1f]/98 backdrop-blur-md rounded-lg mt-2 p-4 border border-cyan-500/20">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="block w-full text-left py-3 text-gray-300 hover:text-cyan-400 transition-colors border-b border-gray-800 last:border-0"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-800">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="text-white text-sm">{user.username}</span>
                  </div>
                  <button onClick={onLogout} className="text-red-400 text-sm">Salir</button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#5865F2] rounded-lg text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  Login con Discord
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const [copied, setCopied] = useState(false);

  const copyIP = () => {
    navigator.clipboard.writeText('play.halarcraft.net');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Moon Icon */}
        <div className="mb-6 animate-float">
          <span className="text-7xl md:text-8xl filter drop-shadow-[0_0_30px_rgba(0,240,255,0.5)]">🌕</span>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
          Halar<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">craft</span> Network
        </h1>

        {/* Subtitle */}
        <p className="font-roboto text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Survival lunar con vibes cyber en Minecraft
        </p>

        {/* Server IP */}
        <div 
          onClick={copyIP}
          className="inline-flex items-center gap-3 px-6 py-4 bg-[#0a0a1f]/80 backdrop-blur-sm rounded-xl border border-cyan-500/30 cursor-pointer group hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 mb-8"
        >
          <div className="text-left">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">IP del Servidor</p>
            <p className="font-orbitron text-xl md:text-2xl font-bold animate-gradient-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto]">
              Próximamente
            </p>
          </div>
          <div className="p-2 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-colors">
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-cyan-400" />}
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button 
            onClick={() => alert('¡El servidor estará disponible pronto! Únete a nuestro Discord para enterarte del lanzamiento.')}
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl font-orbitron font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/40 hover:scale-105"
          >
            <span className="relative z-10">Conectate</span>
            <Zap className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-cyan-400/50" />
        </div>
      </div>
    </section>
  );
};

// Server Section
const ServerSection = () => {
  const features = [
    { icon: Server, title: 'PaperMC 1.20.4', desc: 'Motor optimizado para mejor rendimiento' },
    { icon: Zap, title: 'Velocity Proxy', desc: 'Conexiones rápidas y seguras' },
    { icon: Users, title: 'Geyser + Floodgate', desc: 'Compatible con Bedrock Edition' },
    { icon: Shield, title: 'ViaVersion', desc: 'Soporte desde 1.15 hasta la última versión' },
  ];

  return (
    <section id="servidor" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Sobre el <span className="text-cyan-400">Servidor</span>
          </h2>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 text-sm font-medium">En construcción</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-[#0a0a1f]/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="font-orbitron text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Rules Section
const RulesSection = () => {
  const rules = [
    { icon: Heart, title: 'Respeto Mutuo', desc: 'Trata a todos los jugadores con respeto. No se tolera el acoso, insultos o discriminación.' },
    { icon: Ban, title: 'Sin Hacks', desc: 'Está prohibido el uso de hacks, exploits o cualquier software que de ventajas injustas.' },
    { icon: Shield, title: 'Protege el Server', desc: 'No griefear, robar o destruir construcciones ajenas. Cuida la comunidad.' },
    { icon: MessageCircle, title: 'Chat Limpio', desc: 'Evita spam, publicidad y contenido inapropiado en el chat.' },
  ];

  return (
    <section id="reglas" className="relative py-24 px-4 bg-gradient-to-b from-transparent via-fuchsia-500/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
            Reglas del <span className="text-fuchsia-400">Servidor</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Para mantener un ambiente sano y divertido, todos debemos seguir estas reglas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, index) => (
            <div 
              key={index}
              className="group flex gap-4 p-6 bg-[#0a0a1f]/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-fuchsia-500/50 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 flex items-center justify-center">
                <rule.icon className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <h3 className="font-orbitron text-lg font-bold text-white mb-2">{rule.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Secret Code Button Component (scattered throughout the page)
const SecretCodeButton = ({ code, claimed, onClaim, position }) => {
  return (
    <button
      onClick={onClaim}
      disabled={claimed}
      style={position}
      className={`absolute px-3 py-1.5 rounded-lg transition-all duration-300 font-orbitron text-xs z-20
        ${claimed 
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default shadow-lg shadow-green-500/20' 
          : 'bg-transparent text-transparent hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-fuchsia-500/30 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 border border-transparent hover:border-cyan-500/40'
        }`}
      title={claimed ? `✓ ${code.name}` : 'Código secreto'}
    >
      {claimed ? '✓ ' + code.name : code.name}
    </button>
  );
};

// Player Showcase Section
const PlayerShowcaseSection = ({ user }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'construccion',
    image_url: '',
  });

  // Fetch approved showcases
  const { data: showcases = [], isLoading } = useQuery({
    queryKey: ['showcases'],
    queryFn: async () => {
      const all = await base44.entities.PlayerShowcase.list('-created_date', 50);
      return all.filter(s => s.status === 'approved');
    },
  });

  const createShowcaseMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.PlayerShowcase.create({
        ...data,
        player_name: user.username,
        discord_id: user.id,
        status: 'pending',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['showcases']);
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'construccion', image_url: '' });
      toast.success('¡Tu creación fue enviada y está en revisión!');
    },
    onError: () => {
      toast.error('Error al enviar la creación');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.image_url) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    createShowcaseMutation.mutate(formData);
  };

  return (
    <section id="showcase" className="relative py-24 px-4 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="w-10 h-10 text-cyan-400" />
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
              Player <span className="text-cyan-400">Showcase</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Muestra tus mejores creaciones, construcciones y logros del servidor
          </p>
          
          {user && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-600 hover:to-fuchsia-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showForm ? 'Cancelar' : 'Enviar tu Creación'}
            </Button>
          )}
        </div>

        {/* Submission Form */}
        {showForm && user && (
          <div className="mb-12 p-6 bg-[#0a0a1f]/80 backdrop-blur-sm rounded-2xl border border-cyan-500/30">
            <h3 className="font-orbitron text-xl font-bold text-white mb-6">Nueva Creación</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Mi castillo lunar"
                  className="bg-[#0a0a1f] border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-[#0a0a1f] border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="construccion">Construcción</SelectItem>
                    <SelectItem value="redstone">Redstone</SelectItem>
                    <SelectItem value="pvp">PvP</SelectItem>
                    <SelectItem value="exploracion">Exploración</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Descripción</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe tu creación..."
                  className="bg-[#0a0a1f] border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Imagen</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors"
                  >
                    {uploadingImage ? 'Subiendo...' : 'Elegir imagen'}
                  </label>
                  {formData.image_url && (
                    <span className="text-sm text-green-400">✓ Imagen cargada</span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createShowcaseMutation.isPending || uploadingImage}
                  className="bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                >
                  {createShowcaseMutation.isPending ? 'Enviando...' : 'Enviar para Revisión'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Showcases Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Cargando creaciones...</div>
        ) : showcases.length === 0 ? (
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {user ? 'Sé el primero en mostrar tu creación' : 'Inicia sesión para enviar tus creaciones'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {showcases.map((item) => (
              <div
                key={item.id}
                className="group bg-[#0a0a1f]/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30 text-cyan-400 text-xs">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-orbitron text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">por {item.player_name}</span>
                    <div className="flex items-center gap-1 text-cyan-400">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{item.likes || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Gallery Section
const GallerySection = ({ user }) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    world: 'survival',
    coordinates: '',
    image_url: '',
  });

  // Fetch approved gallery images
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const all = await base44.entities.GalleryImage.list('-created_date', 100);
      return all.filter(img => img.status === 'approved');
    },
  });

  const createImageMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.GalleryImage.create({
        ...data,
        player_name: user.username,
        discord_id: user.id,
        status: 'pending',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gallery']);
      setShowForm(false);
      setFormData({ title: '', world: 'survival', coordinates: '', image_url: '' });
      toast.success('¡Imagen enviada para revisión!');
    },
    onError: () => {
      toast.error('Error al enviar la imagen');
    }
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
      toast.success('Imagen subida correctamente');
    } catch (error) {
      toast.error('Error al subir la imagen');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image_url || !formData.world) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }
    createImageMutation.mutate(formData);
  };

  return (
    <section id="galeria" className="relative py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ImageIcon className="w-10 h-10 text-fuchsia-400" />
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white">
              <span className="text-fuchsia-400">Galería</span> del Servidor
            </h2>
          </div>
          <p className="text-gray-400 mb-6">
            Comparte tus mejores capturas del servidor
          </p>
          
          {user && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600"
            >
              <Upload className="w-4 h-4 mr-2" />
              {showForm ? 'Cancelar' : 'Subir Imagen'}
            </Button>
          )}
        </div>

        {/* Upload Form */}
        {showForm && user && (
          <div className="mb-12 p-6 bg-[#0a0a1f]/80 backdrop-blur-sm rounded-2xl border border-fuchsia-500/30">
            <h3 className="font-orbitron text-xl font-bold text-white mb-6">Nueva Imagen</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Título o Descripción <span className="text-gray-600">(opcional)</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Mi base lunar"
                  className="bg-[#0a0a1f] border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Mundo <span className="text-red-400">*</span>
                  </label>
                  <Select
                    value={formData.world}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, world: value }))}
                  >
                    <SelectTrigger className="bg-[#0a0a1f] border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survival">Survival</SelectItem>
                      <SelectItem value="nether">Nether</SelectItem>
                      <SelectItem value="end">The End</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Coordenadas <span className="text-gray-600">(opcional)</span>
                  </label>
                  <Input
                    value={formData.coordinates}
                    onChange={(e) => setFormData(prev => ({ ...prev, coordinates: e.target.value }))}
                    placeholder="Ej: X:1234 Y:64 Z:-567"
                    className="bg-[#0a0a1f] border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Imagen <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="gallery-image-upload"
                    />
                    <label
                      htmlFor="gallery-image-upload"
                      className="cursor-pointer px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-colors flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {uploadingImage ? 'Subiendo...' : 'Elegir imagen'}
                    </label>
                    {formData.image_url && (
                      <span className="text-sm text-green-400 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Imagen cargada
                      </span>
                    )}
                  </div>
                  
                  {formData.image_url && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-700">
                      <img 
                        src={formData.image_url} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createImageMutation.isPending || uploadingImage}
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                >
                  {createImageMutation.isPending ? 'Enviando...' : 'Enviar para Revisión'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-12">Cargando galería...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {user ? 'Sé el primero en compartir una imagen' : 'Inicia sesión para compartir tus capturas'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div 
                key={img.id}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-gray-800 hover:border-fuchsia-500/50 transition-all duration-300"
              >
                <img 
                  src={img.image_url} 
                  alt={img.title || `Imagen de ${img.player_name}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1f] via-[#0a0a1f]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {img.title && (
                    <h3 className="text-white font-orbitron font-bold mb-2">{img.title}</h3>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="space-y-1">
                      <p className="text-cyan-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {img.player_name}
                      </p>
                      <p className="text-fuchsia-400 flex items-center gap-1">
                        <Server className="w-3 h-3" />
                        {img.world}
                      </p>
                    </div>
                    
                    {img.coordinates && (
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Coordenadas:</p>
                        <p className="text-white text-xs font-mono">{img.coordinates}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top badges */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <div className="px-2 py-1 bg-fuchsia-500/20 backdrop-blur-sm rounded-full border border-fuchsia-500/30 text-fuchsia-400 text-xs font-medium">
                    {img.world}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Discord Section
const DiscordSection = () => {
  return (
    <section id="discord" className="relative py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative p-12 bg-gradient-to-br from-[#5865F2]/20 to-fuchsia-500/10 rounded-3xl border border-[#5865F2]/30 text-center overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/30 rounded-full blur-[100px]" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#5865F2] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#5865F2]/30">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-white mb-4">
              Únete a nuestro Discord
            </h2>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Enterate de las últimas novedades, participa en eventos y conoce a la comunidad
            </p>
            
            <a
              href="https://discord.gg/tu-servidor"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-orbitron font-bold text-lg text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#5865F2]/40 hover:scale-105"
            >
              Unirse al Discord
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="relative py-8 px-4 border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">🌕</span>
          <span className="font-orbitron text-lg text-white">
            Halar<span className="text-cyan-400">craft</span> Network
          </span>
        </div>
        <p className="text-gray-500 text-sm">
          © 2026 Halarcraft Network • Desde Dos de Mayo, Misiones
        </p>
      </div>
    </footer>
  );
};

// Main Component
export default function Home() {
  const [user, setUser] = useState(null);
  const [claimedCodes, setClaimedCodes] = useState([]);
  const [activeSection, setActiveSection] = useState('inicio');

  // Secret code positions scattered across the page
  const codePositions = [
    // Hero section
    { section: 'hero', top: '20%', left: '10%' },
    // Server section
    { section: 'servidor', top: '30%', right: '8%' },
    // Rules section
    { section: 'reglas', top: '15%', left: '5%' },
    // Showcase section
    { section: 'showcase', top: '40%', right: '15%' },
    // Gallery section
    { section: 'galeria', top: '25%', left: '12%' },
  ];

  // Load user and codes from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('halarcraft_user');
    const savedCodes = localStorage.getItem('halarcraft_codes');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedCodes) setClaimedCodes(JSON.parse(savedCodes));
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        // Fetch user info from Discord
        fetch('https://discord.com/api/users/@me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(res => res.json())
          .then(data => {
            const userData = {
              id: data.id,
              username: data.username,
              email: data.email,
              avatar: data.avatar 
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(data.discriminator || '0') % 5}.png`
            };
            setUser(userData);
            localStorage.setItem('halarcraft_user', JSON.stringify(userData));
            window.history.replaceState(null, '', window.location.pathname);
          })
          .catch(console.error);
      }
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'servidor', 'reglas', 'showcase', 'galeria', 'discord'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = () => {
    window.location.href = DISCORD_AUTH_URL;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('halarcraft_user');
  };

  const handleClaimCode = (code) => {
    if (claimedCodes.includes(code.id)) return;
    
    const newClaimed = [...claimedCodes, code.id];
    setClaimedCodes(newClaimed);
    localStorage.setItem('halarcraft_codes', JSON.stringify(newClaimed));
    toast.success(`🎉 Código "${code.name}" reclamado!`, {
      description: `Recompensa: ${code.reward}`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a1f] text-white overflow-x-hidden">
      {/* Background */}
      <StarField />
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a1f] via-transparent to-[#0a0a1f] pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout}
          activeSection={activeSection}
        />
        
        {/* Hero with secret code */}
        <div id="hero" className="relative">
          <HeroSection />
          {user && (
            <SecretCodeButton
              code={SECRET_CODES[0]}
              claimed={claimedCodes.includes(SECRET_CODES[0].id)}
              onClaim={() => handleClaimCode(SECRET_CODES[0])}
              position={codePositions[0]}
            />
          )}
        </div>

        {/* Server with secret code */}
        <div id="servidor" className="relative">
          <ServerSection />
          {user && (
            <SecretCodeButton
              code={SECRET_CODES[1]}
              claimed={claimedCodes.includes(SECRET_CODES[1].id)}
              onClaim={() => handleClaimCode(SECRET_CODES[1])}
              position={codePositions[1]}
            />
          )}
        </div>

        {/* Rules with secret code */}
        <div id="reglas" className="relative">
          <RulesSection />
          {user && (
            <SecretCodeButton
              code={SECRET_CODES[2]}
              claimed={claimedCodes.includes(SECRET_CODES[2].id)}
              onClaim={() => handleClaimCode(SECRET_CODES[2])}
              position={codePositions[2]}
            />
          )}
        </div>

        {/* Showcase with secret code */}
        <div id="showcase" className="relative">
          <PlayerShowcaseSection user={user} />
          {user && (
            <SecretCodeButton
              code={SECRET_CODES[3]}
              claimed={claimedCodes.includes(SECRET_CODES[3].id)}
              onClaim={() => handleClaimCode(SECRET_CODES[3])}
              position={codePositions[3]}
            />
          )}
        </div>

        {/* Gallery with secret code */}
        <div id="galeria" className="relative">
          <GallerySection user={user} />
          {user && (
            <SecretCodeButton
              code={SECRET_CODES[4]}
              claimed={claimedCodes.includes(SECRET_CODES[4].id)}
              onClaim={() => handleClaimCode(SECRET_CODES[4])}
              position={codePositions[4]}
            />
          )}
        </div>

        {/* Codes progress indicator (floating) */}
        {user && (
          <div className="fixed bottom-6 right-6 z-30 p-4 bg-[#0a0a1f]/95 backdrop-blur-md rounded-xl border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-xs text-gray-400">Códigos encontrados</p>
                <p className="text-lg font-orbitron font-bold text-white">
                  {claimedCodes.length}<span className="text-gray-500">/{SECRET_CODES.length}</span>
                </p>
              </div>
            </div>
            {claimedCodes.length === SECRET_CODES.length && (
              <p className="text-xs text-green-400 mt-2">¡Todos encontrados! 🎉</p>
            )}
          </div>
        )}

        <DiscordSection />
        <Footer />
      </div>

      {/* Global styles for animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap');
        
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
        .font-roboto { font-family: 'Roboto', sans-serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-text { animation: gradient-text 3s linear infinite; }
        
        html { scroll-behavior: smooth; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0a0a1f; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #00f0ff, #ff00aa); 
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
