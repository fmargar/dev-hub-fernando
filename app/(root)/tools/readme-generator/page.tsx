"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Copy, CheckCircle2, Download, Eye, Code, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Section {
    id: string;
    title: string;
    enabled: boolean;
    content: string;
}

const initialSections: Section[] = [
    { id: "title", title: "Título y Descripción", enabled: true, content: "" },
    { id: "badges", title: "Badges", enabled: true, content: "" },
    { id: "demo", title: "Demo", enabled: true, content: "" },
    { id: "features", title: "Características", enabled: true, content: "" },
    { id: "install", title: "Instalación", enabled: true, content: "" },
    { id: "usage", title: "Uso", enabled: true, content: "" },
    { id: "api", title: "API Reference", enabled: false, content: "" },
    { id: "tech", title: "Tecnologías", enabled: true, content: "" },
    { id: "roadmap", title: "Roadmap", enabled: false, content: "" },
    { id: "contributing", title: "Contribuir", enabled: false, content: "" },
    { id: "license", title: "Licencia", enabled: true, content: "" },
    { id: "contact", title: "Contacto", enabled: true, content: "" },
];

export default function ReadmeGeneratorPage() {
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [githubUser, setGithubUser] = useState("");
    const [repoName, setRepoName] = useState("");
    const [license, setLicense] = useState("MIT");
    const [sections, setSections] = useState<Section[]>(initialSections);
    const [previewMode, setPreviewMode] = useState<"raw" | "preview">("raw");
    const [copied, setCopied] = useState(false);

    // Features
    const [features, setFeatures] = useState<string[]>(["Feature 1", "Feature 2", "Feature 3"]);
    const [techs, setTechs] = useState<string[]>(["React", "TypeScript", "Tailwind CSS"]);

    const toggleSection = (id: string) => {
        setSections(sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    };

    const addFeature = () => {
        setFeatures([...features, `Feature ${features.length + 1}`]);
    };

    const updateFeature = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const addTech = () => {
        setTechs([...techs, "Nueva Tech"]);
    };

    const updateTech = (index: number, value: string) => {
        const newTechs = [...techs];
        newTechs[index] = value;
        setTechs(newTechs);
    };

    const removeTech = (index: number) => {
        setTechs(techs.filter((_, i) => i !== index));
    };

    const generateReadme = (): string => {
        let readme = "";
        const repo = `${githubUser}/${repoName}`;

        // Título y descripción
        if (sections.find(s => s.id === "title")?.enabled) {
            readme += `<div align="center">\n\n`;
            readme += `# ${projectName || "My Awesome Project"}\n\n`;
            readme += `### ${description || "A brief description of your project"}\n\n`;
            readme += `</div>\n\n`;
        }

        // Badges
        if (sections.find(s => s.id === "badges")?.enabled && githubUser && repoName) {
            readme += `## 📊 Badges\n\n`;
            readme += `![GitHub stars](https://img.shields.io/github/stars/${repo}?style=for-the-badge)\n`;
            readme += `![GitHub forks](https://img.shields.io/github/forks/${repo}?style=for-the-badge)\n`;
            readme += `![GitHub issues](https://img.shields.io/github/issues/${repo}?style=for-the-badge)\n`;
            readme += `![GitHub license](https://img.shields.io/github/license/${repo}?style=for-the-badge)\n\n`;
        }

        // Demo
        if (sections.find(s => s.id === "demo")?.enabled) {
            readme += `## 🚀 Demo\n\n`;
            readme += `![Demo](https://via.placeholder.com/800x400?text=Add+Your+Demo+Screenshot)\n\n`;
            readme += `**[Ver Demo en Vivo](https://your-demo-url.com)** | **[Video Demo](https://youtube.com)**\n\n`;
        }

        // Features
        if (sections.find(s => s.id === "features")?.enabled) {
            readme += `## ✨ Características\n\n`;
            features.forEach(feature => {
                readme += `- ✅ ${feature}\n`;
            });
            readme += `\n`;
        }

        // Tecnologías
        if (sections.find(s => s.id === "tech")?.enabled) {
            readme += `## 🛠️ Tecnologías\n\n`;
            readme += `Este proyecto está construido con:\n\n`;
            techs.forEach(tech => {
                readme += `- **${tech}**\n`;
            });
            readme += `\n`;
        }

        // Instalación
        if (sections.find(s => s.id === "install")?.enabled) {
            readme += `## 📦 Instalación\n\n`;
            readme += `### Prerrequisitos\n\n`;
            readme += `- Node.js >= 18\n`;
            readme += `- npm o yarn\n\n`;
            readme += `### Pasos\n\n`;
            readme += `1. Clona el repositorio:\n\n`;
            readme += `\`\`\`bash\n`;
            readme += `git clone https://github.com/${repo}.git\n`;
            readme += `cd ${repoName || "project"}\n`;
            readme += `\`\`\`\n\n`;
            readme += `2. Instala las dependencias:\n\n`;
            readme += `\`\`\`bash\n`;
            readme += `npm install\n`;
            readme += `# o\n`;
            readme += `yarn install\n`;
            readme += `\`\`\`\n\n`;
            readme += `3. Configura las variables de entorno:\n\n`;
            readme += `\`\`\`bash\n`;
            readme += `cp .env.example .env\n`;
            readme += `# Edita .env con tus configuraciones\n`;
            readme += `\`\`\`\n\n`;
            readme += `4. Inicia el servidor de desarrollo:\n\n`;
            readme += `\`\`\`bash\n`;
            readme += `npm run dev\n`;
            readme += `\`\`\`\n\n`;
        }

        // Uso
        if (sections.find(s => s.id === "usage")?.enabled) {
            readme += `## 🎯 Uso\n\n`;
            readme += `### Ejemplo básico\n\n`;
            readme += `\`\`\`javascript\n`;
            readme += `import { MyComponent } from '${projectName?.toLowerCase() || "my-project"}';\n\n`;
            readme += `function App() {\n`;
            readme += `  return <MyComponent />;\n`;
            readme += `}\n`;
            readme += `\`\`\`\n\n`;
        }

        // API Reference
        if (sections.find(s => s.id === "api")?.enabled) {
            readme += `## 📚 API Reference\n\n`;
            readme += `### \`myFunction(param)\`\n\n`;
            readme += `Descripción de la función.\n\n`;
            readme += `**Parámetros:**\n`;
            readme += `- \`param\` (string): Descripción del parámetro\n\n`;
            readme += `**Retorna:** \`Promise<void>\`\n\n`;
        }

        // Roadmap
        if (sections.find(s => s.id === "roadmap")?.enabled) {
            readme += `## 🗺️ Roadmap\n\n`;
            readme += `- [x] Feature inicial\n`;
            readme += `- [ ] Mejora de rendimiento\n`;
            readme += `- [ ] Soporte para internacionalización\n`;
            readme += `- [ ] Tests end-to-end\n\n`;
        }

        // Contributing
        if (sections.find(s => s.id === "contributing")?.enabled) {
            readme += `## 🤝 Contribuir\n\n`;
            readme += `Las contribuciones son bienvenidas! Por favor:\n\n`;
            readme += `1. Fork el proyecto\n`;
            readme += `2. Crea tu Feature Branch (\`git checkout -b feature/AmazingFeature\`)\n`;
            readme += `3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)\n`;
            readme += `4. Push a la Branch (\`git push origin feature/AmazingFeature\`)\n`;
            readme += `5. Abre un Pull Request\n\n`;
        }

        // License
        if (sections.find(s => s.id === "license")?.enabled) {
            readme += `## 📄 Licencia\n\n`;
            readme += `Distribuido bajo la licencia ${license}. Ver \`LICENSE\` para más información.\n\n`;
        }

        // Contact
        if (sections.find(s => s.id === "contact")?.enabled) {
            readme += `## 📧 Contacto\n\n`;
            if (githubUser) {
                readme += `**${githubUser}**\n\n`;
                readme += `- GitHub: [@${githubUser}](https://github.com/${githubUser})\n`;
                readme += `- Email: your.email@example.com\n`;
            }
            if (repoName && githubUser) {
                readme += `\nProject Link: [https://github.com/${repo}](https://github.com/${repo})\n`;
            }
            readme += `\n`;
        }

        // Footer
        readme += `---\n\n`;
        readme += `<div align="center">\n`;
        readme += `Made with ❤️ by ${githubUser || "Your Name"}\n`;
        readme += `</div>\n`;

        return readme;
    };

    const readmeContent = generateReadme();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(readmeContent);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([readmeContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "README.md";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-[1920px]">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <BookOpen className="w-6 h-6 text-blue-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-2">
                        README.md Generator
                        <Sparkles className="w-7 h-7 text-yellow-500" />
                    </h1>
                </div>
                <p className="text-muted-foreground text-lg">
                    Crea READMEs profesionales para GitHub con plantillas, badges y secciones personalizables.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Configuración - 2 columnas */}
                <motion.div
                    className="xl:col-span-2 space-y-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Info básica */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Información del Proyecto</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Nombre del Proyecto</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    placeholder="My Awesome Project"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Descripción</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                    rows={2}
                                    placeholder="Una breve descripción de tu proyecto"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Usuario GitHub</label>
                                    <input
                                        type="text"
                                        value={githubUser}
                                        onChange={(e) => setGithubUser(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="username"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Nombre del Repo</label>
                                    <input
                                        type="text"
                                        value={repoName}
                                        onChange={(e) => setRepoName(e.target.value)}
                                        className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        placeholder="repository"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Licencia</label>
                                <select
                                    value={license}
                                    onChange={(e) => setLicense(e.target.value)}
                                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="MIT">MIT</option>
                                    <option value="Apache 2.0">Apache 2.0</option>
                                    <option value="GPL-3.0">GPL-3.0</option>
                                    <option value="BSD-3-Clause">BSD-3-Clause</option>
                                    <option value="ISC">ISC</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Características */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Características</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {features.map((feature, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature}
                                        onChange={(e) => updateFeature(index, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Button size="sm" variant="ghost" onClick={() => removeFeature(index)}>
                                        ✕
                                    </Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addFeature} className="w-full">
                                + Añadir Característica
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tecnologías */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Tecnologías</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {techs.map((tech, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={tech}
                                        onChange={(e) => updateTech(index, e.target.value)}
                                        className="flex-1 px-3 py-2 bg-muted/30 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <Button size="sm" variant="ghost" onClick={() => removeTech(index)}>
                                        ✕
                                    </Button>
                                </div>
                            ))}
                            <Button size="sm" variant="outline" onClick={addTech} className="w-full">
                                + Añadir Tecnología
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Secciones */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="py-3 px-4 border-b bg-muted/20">
                            <CardTitle className="text-sm font-medium">Secciones</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {sections.map((section) => (
                                <label
                                    key={section.id}
                                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <span className="text-sm font-medium">{section.title}</span>
                                    <input
                                        type="checkbox"
                                        checked={section.enabled}
                                        onChange={() => toggleSection(section.id)}
                                        className="w-4 h-4 rounded accent-blue-500"
                                    />
                                </label>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Preview - 3 columnas */}
                <motion.div
                    className="xl:col-span-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-border/50 shadow-sm h-[calc(100vh-200px)] flex flex-col sticky top-8">
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b bg-muted/40">
                            <div className="flex items-center gap-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-blue-500" />
                                    README.md
                                </CardTitle>
                                <div className="flex gap-1">
                                    <Button
                                        size="sm"
                                        variant={previewMode === "raw" ? "default" : "ghost"}
                                        className="h-7 text-xs"
                                        onClick={() => setPreviewMode("raw")}
                                    >
                                        <Code className="w-3 h-3 mr-1" />
                                        Raw
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={previewMode === "preview" ? "default" : "ghost"}
                                        className="h-7 text-xs"
                                        onClick={() => setPreviewMode("preview")}
                                    >
                                        <Eye className="w-3 h-3 mr-1" />
                                        Preview
                                    </Button>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={handleDownload}>
                                    <Download className="w-4 h-4" /> README.md
                                </Button>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "outline"}
                                    className={`h-8 gap-1.5 ${copied ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                                    onClick={handleCopy}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> ¡Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" /> Copiar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-auto">
                            {previewMode === "raw" ? (
                                <pre className="p-6 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                    {readmeContent}
                                </pre>
                            ) : (
                                <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: readmeContent.replace(/\n/g, "<br/>") }} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
