// src/components/SiteCard.tsx
import { useState, memo } from 'react';
import { Site } from '../API/http';
import SiteSettingsModal from './SiteSettingsModal';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Skeleton,
  IconButton,
  Box,
  Fade,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface SiteCardProps {
  site: Site;
  onUpdate: (updatedSite: Site) => void;
  onDelete: (siteId: number) => void;
  isEditMode?: boolean;
  index?: number;
  iconApi?: string;
}

const SiteCard = memo(function SiteCard({
  site,
  onUpdate,
  onDelete,
  isEditMode = false,
  index = 0,
  iconApi,
}: SiteCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [iconError, setIconError] = useState(!site.icon);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `site-${site.id || index}`,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 9999 : 'auto',
    opacity: isDragging ? 0.8 : 1,
    position: 'relative' as const,
  };

  const fallbackIcon = site.name.charAt(0).toUpperCase();

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCardClick = () => {
    if (!isEditMode && site.url) {
      window.open(site.url, '_blank');
    }
  };

  const handleIconError = () => {
    setIconError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const cardContent = (
    <Box
      sx={{
        height: '100%',
        position: 'relative',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...(!isEditMode && {
          '&:hover': {
            transform: 'translateY(-5px) scale(1.02)',
          },
        }),
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '18px',
          border: '2px solid rgba(247, 181, 0, 0.35)',
          transition: 'all 0.3s ease-in-out',
          boxShadow: isDragging 
            ? '0 15px 30px rgba(247, 181, 0, 0.4)' 
            : '0 4px 14px rgba(93, 64, 55, 0.06)',
          '&:hover': !isEditMode
            ? {
                borderColor: '#F7B500',
                boxShadow: '0 12px 25px -4px rgba(247, 181, 0, 0.35), 0 6px 10px -4px rgba(229, 57, 53, 0.15)',
              }
            : {},
          overflow: 'hidden',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(45, 38, 32, 0.92)' : 'rgba(255, 253, 245, 0.95)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {isEditMode ? (
          <Box
            sx={{
              height: '100%',
              p: { xs: 1.5, sm: 2 },
              cursor: 'grab',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box position='absolute' top={8} right={8}>
              <DragIndicatorIcon fontSize='small' sx={{ color: '#F7B500' }} />
            </Box>
            <Box display='flex' alignItems='center' mb={1}>
              {!iconError && site.icon ? (
                <Box position='relative' mr={1.5} width={34} height={34} flexShrink={0}>
                  <Skeleton
                    variant='rounded'
                    width={34}
                    height={34}
                    sx={{
                      display: !imageLoaded ? 'block' : 'none',
                      position: 'absolute',
                      borderRadius: '10px',
                      bgcolor: '#FFF8E7',
                    }}
                  />
                  <Fade in={imageLoaded} timeout={500}>
                    <Box
                      component='img'
                      src={site.icon}
                      alt={site.name}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        objectFit: 'cover',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                      onError={handleIconError}
                      onLoad={handleImageLoad}
                    />
                  </Fade>
                </Box>
              ) : (
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    mr: 1.5,
                    borderRadius: '10px',
                    bgcolor: '#FFE082',
                    color: '#5D4037',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #F7B500',
                    boxShadow: '0 2px 5px rgba(247, 181, 0, 0.2)',
                  }}
                >
                  {fallbackIcon}
                </Box>
              )}
              <Typography
                variant='subtitle1'
                fontWeight='700'
                noWrap
                sx={{
                  color: '#5D4037',
                  fontSize: { xs: '0.875rem', sm: '0.95rem' },
                }}
              >
                {site.name}
              </Typography>
            </Box>

            <Typography
              variant='body2'
              sx={{
                color: '#8D6E63',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                flexGrow: 1,
                fontSize: { xs: '0.75rem', sm: '0.825rem' },
              }}
            >
              {site.description || '暂无描述'}
            </Typography>
          </Box>
        ) : (
          <CardActionArea onClick={handleCardClick} sx={{ height: '100%' }}>
            <CardContent
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 1.5, sm: 2 },
                '&:last-child': { pb: { xs: 1.5, sm: 2 } },
              }}
            >
              <Box display='flex' alignItems='center' mb={1}>
                {!iconError && site.icon ? (
                  <Box position='relative' mr={1.5} width={34} height={34} flexShrink={0}>
                    <Skeleton
                      variant='rounded'
                      width={34}
                      height={34}
                      sx={{
                        display: !imageLoaded ? 'block' : 'none',
                        position: 'absolute',
                        borderRadius: '10px',
                        bgcolor: '#FFF8E7',
                      }}
                    />
                    <Fade in={imageLoaded} timeout={500}>
                      <Box
                        component='img'
                        src={site.icon}
                        alt={site.name}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: '10px',
                          objectFit: 'cover',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        }}
                        onError={handleIconError}
                        onLoad={handleImageLoad}
                      />
                    </Fade>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      mr: 1.5,
                      borderRadius: '10px',
                      bgcolor: '#FFE082',
                      color: '#5D4037',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #F7B500',
                      boxShadow: '0 2px 5px rgba(247, 181, 0, 0.2)',
                    }}
                  >
                    {fallbackIcon}
                  </Box>
                )}
                <Typography
                  variant='subtitle1'
                  fontWeight='700'
                  noWrap
                  sx={{
                    color: '#5D4037',
                    fontSize: { xs: '0.875rem', sm: '0.95rem' },
                  }}
                >
                  {site.name}
                </Typography>
              </Box>

              <Typography
                variant='body2'
                sx={{
                  color: '#8D6E63',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flexGrow: 1,
                  fontSize: { xs: '0.75rem', sm: '0.825rem' },
                }}
              >
                {site.description || '暂无描述'}
              </Typography>

              <IconButton
                size='small'
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: '#FFF8E7',
                  color: '#E53935',
                  opacity: 0,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#E53935',
                    color: '#FFF',
                  },
                  '.MuiCardActionArea-root:hover &': {
                    opacity: 1,
                  },
                }}
                onClick={handleSettingsClick}
                aria-label='网站设置'
              >
                <SettingsIcon fontSize='small' />
              </IconButton>
            </CardContent>
          </CardActionArea>
        )}
      </Card>
    </Box>
  );

  if (isEditMode) {
    return (
      <>
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          {cardContent}
        </div>

        {showSettings && (
          <SiteSettingsModal
            site={site}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onClose={handleCloseSettings}
            iconApi={iconApi}
          />
        )}
      </>
    );
  }

  return (
    <>
      {cardContent}

      {showSettings && (
        <SiteSettingsModal
          site={site}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onClose={handleCloseSettings}
          iconApi={iconApi}
        />
      )}
    </>
  );
});

export default SiteCard;
