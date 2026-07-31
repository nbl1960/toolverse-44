"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, FolderOpen, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteCollection,
  getCollections,
  removeToolFromCollection,
  renameCollection,
  COLLECTIONS_CHANGED_EVENT,
} from "@/lib/collections";
import { getToolBySlug } from "@/lib/tools-registry";
import { resolveIcon } from "@/lib/icon-map";
import type { Collection } from "@/lib/collections";
import type { IconName } from "@/lib/icon-map";

/** Reads from localStorage on mount, same reasoning as DashboardContent and PromptHistoryPanel. */
export function CollectionsContent() {
  const [collections, setCollections] = React.useState<Collection[] | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState("");

  React.useEffect(() => {
    setCollections(getCollections());
    function handleChange() {
      setCollections(getCollections());
    }
    window.addEventListener(COLLECTIONS_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(COLLECTIONS_CHANGED_EVENT, handleChange);
  }, []);

  function startEditing(collection: Collection) {
    setEditingId(collection.id);
    setEditingName(collection.name);
  }

  function saveEditing() {
    if (editingId) setCollections(renameCollection(editingId, editingName));
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setCollections(deleteCollection(id));
  }

  function handleRemoveTool(collectionId: string, slug: string) {
    setCollections(removeToolFromCollection(collectionId, slug));
  }

  if (collections === null) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-card" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <FolderOpen className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 text-sm text-muted-foreground">
          No collections yet — open any tool and use the folder icon to start one.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/tools">
            Browse all tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {collections.map((collection) => {
        const tools = collection.toolSlugs.map((slug) => getToolBySlug(slug)).filter((t) => Boolean(t));
        const isEditing = editingId === collection.id;
        return (
          <section key={collection.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEditing();
                  }}
                  className="flex flex-1 items-center gap-2"
                >
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    autoFocus
                    className="h-8 text-sm"
                    aria-label="Collection name"
                  />
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </form>
              ) : (
                <h2 className="font-display text-base font-semibold text-foreground">
                  {collection.name}{" "}
                  <span className="font-sans text-xs font-normal text-muted-foreground">({tools.length})</span>
                </h2>
              )}
              {!isEditing && (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => startEditing(collection)}
                    aria-label={`Rename ${collection.name}`}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(collection.id)}
                    aria-label={`Delete ${collection.name}`}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            {tools.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Empty — add tools to it from any tool page&apos;s folder icon.
              </p>
            ) : (
              <div className="mt-3 flex flex-col gap-1.5">
                {tools.map((tool) => {
                  if (!tool) return null;
                  const Icon = resolveIcon(tool.iconName as IconName);
                  return (
                    <div key={tool.slug} className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2">
                      <Link href={`/tools/${tool.slug}`} className="flex min-w-0 items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0 text-brass" aria-hidden="true" />
                        <span className="truncate text-sm text-foreground">{tool.name}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(collection.id, tool.slug)}
                        aria-label={`Remove ${tool.name} from ${collection.name}`}
                        className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                      >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
