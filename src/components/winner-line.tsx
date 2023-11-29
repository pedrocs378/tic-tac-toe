import { cva } from 'class-variance-authority'

type WinnerLineProps = {
  onAnimationEnd?: () => void
  highlight?: boolean
  orientation: 'horizontal' | 'vertical' | 'diagonal'
  position:
    | 'top'
    | 'middle'
    | 'bottom'
    | 'left'
    | 'right'
    | 'tl-to-br'
    | 'tr-to-bl'
}

const lineVariants = cva(
  'group-data-[highlight=true]:bg-primary absolute rounded-full bg-foreground duration-700',
  {
    variants: {
      orientation: {
        vertical: 'h-full w-1 animate-to-down',
        horizontal: 'h-1 w-full animate-to-right',
        diagonal: 'h-[calc(100%*1.4)] w-1 animate-to-diagonal-down',
      },
      position: {
        'tl-to-br': '-rotate-45 origin-top-left',
        'tr-to-bl': 'right-0 rotate-45 origin-top-right',
      },
    },
  },
)

export function WinnerLine({
  orientation,
  position,
  highlight = false,
  onAnimationEnd,
}: WinnerLineProps) {
  return (
    <div
      data-highlight={highlight}
      className="group absolute inset-4 md:inset-8 flex gap-4"
      onAnimationEnd={onAnimationEnd}
    >
      {/* VERTICAL */}
      {orientation === 'vertical' && (
        <>
          {position === 'left' && (
            <div
              style={{ left: 'calc((100%/3)/2)' }}
              className={lineVariants({ orientation: 'vertical' })}
            />
          )}
          {position === 'middle' && (
            <div
              style={{ left: 'calc(100%/2)' }}
              className={lineVariants({ orientation: 'vertical' })}
            />
          )}
          {position === 'right' && (
            <div
              style={{ left: 'calc(100% - ((100% / 3) / 2))' }}
              className={lineVariants({ orientation: 'vertical' })}
            />
          )}
        </>
      )}

      {/* HORIZONTAL */}
      {orientation === 'horizontal' && (
        <>
          {position === 'top' && (
            <div
              style={{ top: 'calc((100%/3)/2)' }}
              className={lineVariants({ orientation: 'horizontal' })}
            />
          )}
          {position === 'middle' && (
            <div
              style={{ top: 'calc(100%/2)' }}
              className={lineVariants({ orientation: 'horizontal' })}
            />
          )}
          {position === 'bottom' && (
            <div
              style={{ top: 'calc(100% - ((100% / 3) / 2))' }}
              className={lineVariants({ orientation: 'horizontal' })}
            />
          )}
        </>
      )}

      {/* DIAGONAL */}
      {orientation === 'diagonal' && (
        <>
          {position === 'tl-to-br' && (
            <div
              className={lineVariants({
                orientation: 'diagonal',
                position: 'tl-to-br',
              })}
            />
          )}
          {position === 'tr-to-bl' && (
            <div
              className={lineVariants({
                orientation: 'diagonal',
                position: 'tr-to-bl',
              })}
            />
          )}
        </>
      )}
    </div>
  )
}
