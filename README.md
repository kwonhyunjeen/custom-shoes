# Custom Shoes - AI-Powered 3D Shoe Customization Platform

A web application that combines 3D visualization with AI-powered natural language processing to create an shoe customization experience. Users can interact with 3D shoe models through both UI controls and natural language commands.

👉🏻 [Custom Shoes Project Dev Blog](https://kwonhyunjin.super.site/learnings)

## ✨ Features

**🎨 Interactive 3D Customization**

- Real-time 3D shoe model manipulation with smooth camera controls
- Click-to-select shoe parts with highlighting
- Comprehensive color palette with part-specific color rules
- Lighting and shadow effects for realistic visualization

**🤖 AI-Powered Natural Language Interface**

- Natural language color commands (e.g., "Make the laces look summery!")
- Powered by Groq LLM through Supabase Edge Functions
- Intelligent color interpretation and application
- Seamless integration with manual customization

**🎯 Advanced User Experience**

- Responsive design optimized for all devices
- Keyboard navigation support for accessibility
- Smooth animations and transitions
- Part-specific camera positioning for detailed viewing

## 🏗 Architecture

**Monorepo Structure**

- `/app` - React frontend application
- `/api` - Supabase Edge Functions for AI processing

**Tech Stack**

- **Frontend:** React 19 + TypeScript + Vite
- **3D Graphics:** Three.js + React Three Fiber + React Three Drei
- **Styling:** Tailwind CSS v4 with custom design system
- **AI Backend:** Supabase Edge Functions + Groq LLM
- **State Management:** React Context + Custom hooks
- **Development:** ESLint + Prettier + Lefthook

## 🚀 Getting Started

**Prerequisites**

- Node.js 20+
- pnpm 9+ (recommended)
- Supabase CLI (for AI features)

**Installation**

```bash
# Clone the repository
git clone https://github.com/kwonhyunjeen/custom-shoes.git
cd custom-shoes

# Install root dependencies
pnpm install

# Install app dependencies
cd app && pnpm install

# Install API dependencies
cd ../api && pnpm install
```

**Development**

```bash
# Start the frontend (from /app directory)
cd app && pnpm run dev

# Start Supabase local development (from /api directory)
cd api && supabase start
```

The application will be available at http://localhost:5173

**Available Scripts**

**Frontend (app/)**

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run lint         # Run ESLint
pnpm run typecheck    # Type checking
```

**API (api/)**

```bash
supabase start        # Start local Supabase
supabase functions serve  # Serve edge functions locally
```

## 🎯 Current Implementation Status

**✅ Completed Features**

- ✅ Interactive 3D shoe model with realistic lighting
- ✅ Click-to-select shoe parts with highlighting
- ✅ Comprehensive color customization system
- ✅ AI-powered natural language color commands
- ✅ Smooth camera controls and animations
- ✅ Part-specific color rules and validation
- ✅ Responsive UI with accessibility features
- ✅ Advanced state management

**🚧 Future Enhancements**

- [ ] Material and texture options (leather, fabric, etc.)
- [ ] Advanced WebGL shaders and visual effects
- [ ] Multi-language AI command support

## 🏗 Project Structure

```
custom-shoes/
├── app/                    # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── customization/  # 3D customization components
│   │   │   └── ui/            # Reusable UI components
│   │   ├── data/          # Static data and configurations
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── public/
│       └── models/        # 3D GLB model files
├── api/                   # Supabase Edge Functions
│   └── supabase/
│       └── functions/     # AI processing functions
└── README.md
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

**🙏 Acknowledgments**

- **Nike By You** for design inspiration and UX patterns
- **React Three Fiber community** for excellent documentation and examples
- **Three.js ecosystem** for powerful 3D capabilities and extensive community
- **Supabase** for seamless backend infrastructure
- **Groq** for fast and efficient AI model inference

---

**Built with ❤️ by [Kwon Hyun Jin](https://kwonhyunjin.super.site/)**

This project demonstrates the intersection of modern web development, 3D graphics, and AI integration. From concept to completion, it showcases advanced React patterns, WebGL optimization, and natural language processing in a real-world application. 🚀
