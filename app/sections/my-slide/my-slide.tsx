import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {forwardRef, useEffect, useState} from 'react';
import {useKeenSlider, KeenSliderPlugin} from 'keen-slider/react.es';
import clsx from 'clsx';
import './style.css';
interface MySlideShowProps extends HydrogenComponentProps {
  sizeSection: string;
  enableAutoplay: boolean;
  enableLoop: boolean;
  textAlignment: string;
  showNavigation: boolean;
}

let MySlideShow = forwardRef<HTMLElement, MySlideShowProps>((props, ref) => {
  let {
    sizeSection,
    enableAutoplay,
    textAlignment,
    enableLoop,
    showNavigation,
    children,
    ...rest
  } = props;
  const autoSlide: KeenSliderPlugin = (slider) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;
    function clearNextTimeout() {
      clearTimeout(timeout);
    }
    function nextTimeout() {
      clearTimeout(timeout);
      if (mouseOver) return;
      timeout = setTimeout(() => {
        slider.next();
      }, 2000);
    }
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });
    slider.on('dragStarted', clearNextTimeout);
    slider.on('animationEnded', nextTimeout);
    slider.on('updated', nextTimeout);
  };
  const [plugin, setPlugin] = useState<KeenSliderPlugin[]>(
    [] as KeenSliderPlugin[],
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [options, setOptions] = useState({
    initial: 0,
    loop: false,
    slideChanged(slider: any) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });
  const [sliderRef, instanceRef] = useKeenSlider(options, plugin);
  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      loop: enableLoop,
    }));
  }, [enableLoop]);

  useEffect(() => {
    if (enableAutoplay) {
      setPlugin((prev) => [...prev, autoSlide]);
      instanceRef.current?.update();
    } else {
      setPlugin([]);
      instanceRef.current?.update();
    }
  }, [enableAutoplay, instanceRef]);
  useEffect(() => {
    if (instanceRef) {
      instanceRef.current?.update();
    }
  }, [children, instanceRef]);
  return (
    <section ref={ref} {...rest}>
      <div
        className={clsx(
          'cursor-pointer rounded-sm ',
          textAlignment,
          showNavigation ? '' : 'mb-8',
          sizeSection === 'container' ? 'mr-16 ml-16' : sizeSection,
        )}
      >
        <div ref={sliderRef} className="keen-slider">
          {children?.map((item, index) => (
            <div className="keen-slider__slide" key={index}>
              {item}
            </div>
          ))}
        </div>
        <div>
          {showNavigation && loaded && instanceRef.current && (
            <div className="dots relative top-[-33px]">
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length,
                ).keys(),
              ].map((idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      instanceRef.current?.moveToIdx(idx);
                    }}
                    className={'dot' + (currentSlide === idx ? ' active' : '')}
                  ></button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

export default MySlideShow;

export let schema: HydrogenComponentSchema = {
  type: 'my-slide-show',
  title: 'My slide',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'General',
      inputs: [
        {
          type: 'toggle-group',
          label: 'Size',
          name: 'sizeSection',
          configs: {
            options: [
              {value: 'w-full', label: 'Full screen'},
              {value: 'container', label: 'In container'},
            ],
          },
          defaultValue: 'w-full',
        },

        {
          type: 'toggle-group',
          label: 'Text alignment',
          name: 'textAlignment',
          configs: {
            options: [
              {value: 'align-left', label: 'Left'},
              {value: 'align-center', label: 'Center'},
            ],
          },
          defaultValue: 'align-center',
        },
      ],
    },

    {
      group: 'Slider options',
      inputs: [
        {
          type: 'switch',
          label: 'Enable autoplay',
          name: 'enableAutoplay',
          defaultValue: false,
        },

        {
          type: 'switch',
          label: 'Disable sliding on hover',
          name: 'disableSlide',
          defaultValue: false,
        },
        {
          type: 'switch',
          label: 'Show navigation',
          name: 'showNavigation',
          defaultValue: true,
        },
        {
          type: 'switch',
          label: 'Enable Loop',
          name: 'enableLoop',
          defaultValue: false,
        },
        {
          type: 'range',
          label: 'Speed sliding',
          name: 'speedSliding',
          defaultValue: 1,
          configs: {
            min: 1,
            max: 5,
            step: 1,
            unit: 's',
          },
        },
        {
          type: 'range',
          label: 'Delay sliding',
          name: 'delaySliding',
          defaultValue: 1,
          configs: {
            min: 1,
            max: 5,
            step: 1,
            unit: 's',
          },
        },
      ],
    },
  ],
  childTypes: ['my-slide-child'],
  presets: {
    children: [
      {
        type: 'my-slide-child',
      },
      {
        type: 'my-slide-child',
      },
    ],
  },
};
