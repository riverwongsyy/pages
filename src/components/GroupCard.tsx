// src/components/GroupCard.tsx
import React, { useState, useEffect } from 'react';
import { Site, Group } from '../API/http';
import SiteCard from './SiteCard';
import { GroupWithSites } from '../types';
import EditGroupDialog from './EditGroupDialog';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Collapse,
  Chip,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface GroupCardProps {
  group: GroupWithSites;
  index?: number;
  sortMode: 'None' | 'GroupSort' | 'SiteSort';
  currentSortingGroupId: number | null;
  onUpdate: (updatedSite: Site) => void;
  onDelete: (siteId: number) => void;
  onSaveSiteOrder: (groupId: number, sites: Site[]) => void;
  onStartSiteSort: (groupId: number) => void;
  onAddSite?: (groupId: number) => void;
  onUpdateGroup?: (group: Group) => void;
  onDeleteGroup?: (groupId: number) => void;
  configs?: Record<string, string>;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  sortMode,
  currentSortingGroupId,
  onUpdate,
  onDelete,
  onSaveSiteOrder,
  onStartSiteSort,
  onAddSite,
  onUpdateGroup,
  onDeleteGroup,
  configs,
}) => {
  const [sites, setSites] = useState<Site[]>(group.sites);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem(`group-${group.id}-collapsed`);
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    if (group.id) {
      localStorage.setItem(`group-${group.id}-collapsed`, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed, group.id]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleSiteDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sites.findIndex((site) => `site-${site.id}` === active.id);
      const newIndex = sites.findIndex((site) => `site-${site.id}` === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newSites = arrayMove(sites, oldIndex, newIndex);
        setSites(newSites);
      }
    }
  };

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    if (onUpdateGroup) {
      onUpdateGroup(updatedGroup);
      setEditDialogOpen(false);
    }
  };

  const handleDeleteGroup = (groupId: number) => {
    if (onDeleteGroup) {
      onDeleteGroup(groupId);
      setEditDialogOpen(false);
    }
  };

  const isCurrentEditingGroup = sortMode === 'SiteSort' && currentSortingGroupId === group.id;

  const renderSites = () => {
    const sitesToRender = isCurrentEditingGroup ? sites : group.sites;

    if (!isCurrentEditingGroup && sortMode === 'SiteSort') {
      return null;
    }

    if (isCurrentEditingGroup) {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSiteDragEnd}
        >
          <SortableContext
            items={sitesToRender.map((site) => `site-${site.id}`)}
            strategy={horizontalListSortingStrategy}
          >
            <Box sx={{ width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  margin: -1,
                }}
              >
                {sitesToRender.map((site, idx) => (
                  <Box
                    key={site.id || idx}
                    sx={{
                      width: {
                        xs: '50%',
                        sm: '50%',
                        md: '25%',
                        lg: '25%',
                        xl: '25%',
                      },
                      padding: 1,
                      boxSizing: 'border-box',
                    }}
                  >
                    <SiteCard
                      site={site}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      isEditMode={true}
                      index={idx}
                      iconApi={configs?.['site.iconApi']}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </SortableContext>
        </DndContext>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: -1,
        }}
      >
        {sitesToRender.map((site) => (
          <Box
            key={site.id}
            sx={{
              width: {
                xs: '100%',
                sm: '50%',
                md: '33.33%',
                lg: '25%',
                xl: '20%',
              },
              padding: 1,
              boxSizing: 'border-box',
            }}
          >
            <SiteCard
              site={site}
              onUpdate={onUpdate}
              onDelete={onDelete}
              isEditMode={false}
              iconApi={configs?.['site.iconApi']}
            />
          </Box>
        ))}
      </Box>
    );
  };

  const handleSaveSiteOrder = () => {
    onSaveSiteOrder(group.id!, sites);
  };

  const handleSortClick = () => {
    if (group.sites.length < 2) {
      setSnackbarMessage('至少需要2个站点才能进行排序');
      setSnackbarOpen(true);
      return;
    }
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    onStartSiteSort(group.id!);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '24px',
        p: { xs: 2, sm: 3 },
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        border: '2.5px solid rgba(247, 181, 0, 0.35)',
        boxShadow: sortMode === 'None' ? '0 8px 24px -4px rgba(93, 64, 55, 0.08)' : 'none',
        '&:hover': {
          boxShadow: sortMode === 'None' ? '0 14px 30px -4px rgba(247, 181, 0, 0.25)' : 'none',
          borderColor: '#F7B500',
        },
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(38, 32, 27, 0.95)' : 'rgba(255, 253, 245, 0.95)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        display='flex'
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={2.5}
        gap={1}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            '&:hover': {
              '& .collapse-icon': {
                color: '#E53935',
              },
            },
          }}
          onClick={handleToggleCollapse}
        >
          <IconButton
            size='small'
            className='collapse-icon'
            sx={{
              color: '#F7B500',
              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
          
          <Typography
            variant='h5'
            component='h2'
            fontWeight='800'
            sx={{ 
              color: '#5D4037', 
              mb: { xs: 1, sm: 0 },
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <span>🍯</span>
            {group.name}
            <Chip
              label={group.sites.length}
              size='small'
              sx={{
                bgcolor: '#FFE082',
                color: '#5D4037',
                fontWeight: 'bold',
                borderRadius: '12px',
                ml: 0.5,
                border: '1px solid #F7B500'
              }}
            />
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'row', sm: 'row' },
            gap: 1.2,
            width: { xs: '100%', sm: 'auto' },
            flexWrap: 'wrap',
            justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          }}
        >
          {isCurrentEditingGroup ? (
            <Button
              variant='contained'
              size='small'
              startIcon={<SaveIcon />}
              onClick={handleSaveSiteOrder}
              sx={{
                bgcolor: '#E53935',
                color: '#FFF',
                borderRadius: '20px',
                fontWeight: 'bold',
                px: 2,
                boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
                '&:hover': { bgcolor: '#C62828' },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
              }}
            >
              保存顺序
            </Button>
          ) : (
            sortMode === 'None' && (
              <>
                {onAddSite && (
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => onAddSite(group.id!)}
                    startIcon={<AddIcon />}
                    sx={{
                      bgcolor: '#E53935',
                      color: '#FFF',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      px: 2,
                      boxShadow: '0 4px 12px rgba(229, 57, 53, 0.3)',
                      '&:hover': { bgcolor: '#C62828' },
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    }}
                  >
                    添加卡片
                  </Button>
                )}
                <Button
                  variant='outlined'
                  size='small'
                  startIcon={<SortIcon />}
                  onClick={handleSortClick}
                  sx={{
                    borderColor: '#F7B500',
                    color: '#5D4037',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    px: 2,
                    '&:hover': {
                      borderColor: '#FFC107',
                      bgcolor: '#FFF8E7',
                    },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  排序
                </Button>

                {onUpdateGroup && onDeleteGroup && (
                  <Tooltip title='编辑分组'>
                    <IconButton
                      onClick={handleEditClick}
                      size='small'
                      sx={{
                        color: '#5D4037',
                        bgcolor: '#FFF8E7',
                        '&:hover': { bgcolor: '#FFE082' },
                        alignSelf: 'center',
                      }}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )
          )}
        </Box>
      </Box>

      <Collapse in={!isCollapsed} timeout='auto'>
        {renderSites()}
      </Collapse>

      {onUpdateGroup && onDeleteGroup && (
        <EditGroupDialog
          open={editDialogOpen}
          group={group}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleUpdateGroup}
          onDelete={handleDeleteGroup}
        />
      )}

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity='info' sx={{ width: '100%', borderRadius: '14px' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default GroupCard;
