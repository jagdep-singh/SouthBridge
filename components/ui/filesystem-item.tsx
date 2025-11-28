"use client";
//AI Used also got it fomr 21st.dev
import { useState } from "react";
import { ChevronRight, Folder, File } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type Node = {
  name: string;
  nodes?: Node[];
  id?: string;
};

interface FilesystemItemProps {
  node: Node;
  animated?: boolean;
  onFileClick?: (node: Node) => void;
}

export function FilesystemItem({
  node,
  animated = false,
  onFileClick,
}: FilesystemItemProps) {
  let [isOpen, setIsOpen] = useState(false);

  const ChevronIcon = () =>
    animated ? (
      <motion.span
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="flex"
      >
        <ChevronRight className="size-4 text-gray-500" />
      </motion.span>
    ) : (
      <ChevronRight className={`size-4 text-gray-500 ${isOpen ? "rotate-90" : ""}`} />
    );

  const ChildrenList = () => {
    const children = node.nodes?.map((n) => (
      <FilesystemItem key={n.name} node={n} animated={animated} onFileClick={onFileClick} />
    ));

    if (animated) {
      return (
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="pl-4 overflow-hidden flex flex-col justify-end"
            >
              {children}
            </motion.ul>
          )}
        </AnimatePresence>
      );
    }

    return isOpen && <ul className="pl-6">{children}</ul>;
  };

  const isFolder = Boolean(node.nodes && node.nodes.length > 0);

  return (
    <li key={node.name}>
      <span
        className="flex items-center gap-1.5 py-1 cursor-pointer select-none hover:bg-[#1f2330] rounded-md px-2"
        role={isFolder ? "button" : undefined}
        tabIndex={isFolder ? 0 : undefined}
        onClick={(e) => {
          // folder 
          if (isFolder) {
            setIsOpen(!isOpen);
            return;
          }

          // leaf/file 
          if (onFileClick) {
            onFileClick(node);
          }
        }}
        onKeyDown={(e) => {
          if (isFolder && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (!isFolder && onFileClick && (e.key === "Enter" || e.key === " ")) {
            // file 
            e.preventDefault();
            onFileClick(node);
          }
        }}
      >
        {isFolder && (
          <button
            onClick={(ev) => {
              ev.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="p-1 -m-1"
            aria-label={isOpen ? "Collapse folder" : "Expand folder"}
          >
            <ChevronIcon />
          </button>
        )}

        {isFolder ? (
          <Folder
            className={`size-6 text-sky-500 fill-sky-500 ${node.nodes && node.nodes.length === 0 ? "ml-3" : ""}`}
          />
        ) : (
          <File color="rgba(96, 162, 255, 0.68)" className="ml-3 size-6 text-gray-900" />
        )}

        {node.name}
      </span>
        <ChildrenList />
    </li>
  );
}
