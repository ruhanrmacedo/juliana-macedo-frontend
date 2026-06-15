import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Heading2,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
} from "lucide-react";
import { useEffect } from "react";

type Props = {
    value: string;
    onChange: (html: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
            }),
            Image,
            Placeholder.configure({
                placeholder: "Escreva o conteúdo do post aqui...",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class:
                    "min-h-[280px] rounded-b-lg border border-t-0 border-emerald-200 px-4 py-4 outline-none prose prose-sm max-w-none focus:ring-2 focus:ring-emerald-400 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:list-decimal [&_ol]:pl-8 [&_li]:mb-1",
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;

        if (value !== editor.getHTML()) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    if (!editor) return null;

    const addLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL do link:", previousUrl || "https://");

        if (url === null) return;

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt("URL da imagem:", "https://");

        if (!url) return;

        editor.chain().focus().setImage({ src: url }).run();
    };

    const buttonClass = (active?: boolean) =>
        `rounded-md border px-2 py-1 text-sm hover:bg-emerald-50 ${active ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-white text-gray-700 border-gray-200"
        }`;

    return (
        <div>
            <div className="flex flex-wrap gap-2 rounded-t-lg border border-emerald-200 bg-emerald-50 p-2">
                <button type="button" className={buttonClass(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
                    <Bold size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
                    <Italic size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                    <Heading2 size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
                    <List size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                    <Quote size={16} />
                </button>

                <button type="button" className={buttonClass()} onClick={addLink}>
                    <LinkIcon size={16} />
                </button>

                <button type="button" className={buttonClass()} onClick={addImage}>
                    <ImageIcon size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                    <AlignLeft size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                    <AlignCenter size={16} />
                </button>

                <button type="button" className={buttonClass(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                    <AlignRight size={16} />
                </button>

                <button type="button" className={buttonClass()} onClick={() => editor.chain().focus().undo().run()}>
                    <Undo size={16} />
                </button>

                <button type="button" className={buttonClass()} onClick={() => editor.chain().focus().redo().run()}>
                    <Redo size={16} />
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}