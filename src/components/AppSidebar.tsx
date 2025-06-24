
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Folder, Tag, Settings, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Folder as FolderType } from "@/pages/Index";

interface AppSidebarProps {
  folders: FolderType[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onSettingsClick: () => void;
  onAddFolder: (name: string, color: string) => void;
}

const folderColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

export const AppSidebar = ({
  folders,
  selectedFolder,
  onFolderSelect,
  allTags,
  selectedTags,
  onTagsChange,
  onSettingsClick,
  onAddFolder,
}: AppSidebarProps) => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("bg-blue-500");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName("");
      setNewFolderColor("bg-blue-500");
      setShowAddFolder(false);
    }
  };

  return (
    <Sidebar className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-r border-white/20 dark:border-slate-700/50">
      <SidebarHeader className="p-4 border-b border-white/20 dark:border-slate-700/50">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Navigation</h2>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Folders Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              Folders
            </div>
            <Dialog open={showAddFolder} onOpenChange={setShowAddFolder}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Add New Folder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Folder Name</label>
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Enter folder name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Color</label>
                    <div className="flex gap-2 mt-2">
                      {folderColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewFolderColor(color)}
                          className={`w-6 h-6 rounded ${color} ${
                            newFolderColor === color ? "ring-2 ring-slate-400 dark:ring-slate-300" : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowAddFolder(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddFolder}>
                      Add Folder
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={selectedFolder === "all"}
                  onClick={() => onFolderSelect("all")}
                >
                  All Notes
                </SidebarMenuButton>
              </SidebarMenuItem>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <SidebarMenuButton
                    isActive={selectedFolder === folder.id}
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <div className={`w-3 h-3 rounded ${folder.color} mr-2`} />
                    {folder.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tags Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-wrap gap-2 p-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "secondary"}
                  className={`cursor-pointer text-xs transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                  onClick={() => toggleTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
              {allTags.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 p-2">No tags yet</p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20 dark:border-slate-700/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onSettingsClick}>
              <Settings className="h-4 w-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
